"use client";

import {
  IconBuildingStore,
  IconEdit,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { useState } from "react";
import { Details } from "@/components/details";

import type { RestaurantDto, RestaurantStatus } from "@/api-contracts";
import {
  Badge,
  Button,
  Dialog,
  Table,
  Typography,
  type AppBadgeTone,
  type TableColumn,
} from "@/components/ui";
import { showSuccessNotification } from "@/components/ui/notification";
import { RestaurantFormDialog } from "@/components/restaurant-form-dialog";
import {
  useDeleteRestaurantMutation,
  useGetRestaurantsQuery,
} from "@/store/api/super-admin.api";

import { AdminPageWrapper } from "../admin-page-wrapper";

const RESTAURANTS_PER_PAGE = 10;

const statusPresentation: Record<
  RestaurantStatus,
  { label: string; tone: AppBadgeTone }
> = {
  ACTIVE: { label: "Активен", tone: "success" },
  SUSPENDED: { label: "Приостановлен", tone: "warning" },
  ARCHIVED: { label: "В архиве", tone: "neutral" },
};

const dateTimeFormatter = new Intl.DateTimeFormat("ru-RU", {
  dateStyle: "medium",
  timeStyle: "short",
});

const restaurantColumns: readonly TableColumn<RestaurantDto>[] = [
  {
    key: "name",
    header: "Название",
    mobileLayout: "primary",
    render: (restaurant) => (
      <span className="break-words font-extrabold md:whitespace-nowrap">
        {restaurant.name}
      </span>
    ),
    width: 160,
  },
  {
    key: "slug",
    header: "Slug",
    mobileFullWidth: true,
    render: (restaurant) => (
      <code className="break-all rounded bg-surface-muted px-2 py-1 text-xs text-secondary md:whitespace-nowrap">
        {restaurant.slug}
      </code>
    ),
    width: 160,
  },
  {
    key: "status",
    header: "Статус",
    render: (restaurant) => {
      const status = statusPresentation[restaurant.status];

      return <Badge tone={status.tone}>{status.label}</Badge>;
    },
    width: 140,
  },
  {
    key: "createdAt",
    header: "Создан",
    mobileFullWidth: true,
    render: (restaurant) => (
      <time className="whitespace-nowrap" dateTime={restaurant.createdAt}>
        {dateTimeFormatter.format(new Date(restaurant.createdAt))}
      </time>
    ),
    width: 190,
  },
];

const SuperAdminRestaurantsPage = () => {
  const [page, setPage] = useState(1);
  const [formOpened, setFormOpened] = useState(false);
  const [editingRestaurant, setEditingRestaurant] =
    useState<RestaurantDto | null>(null);
  const [restaurantToDelete, setRestaurantToDelete] =
    useState<RestaurantDto | null>(null);
  const [deleteDialogOpened, setDeleteDialogOpened] = useState(false);
  const [restaurantDetails, setRestaurantDetails] =
    useState<RestaurantDto | null>(null);
  const [detailsOpened, setDetailsOpened] = useState(false);
  const [deleteRestaurant, { isLoading: isDeleting }] =
    useDeleteRestaurantMutation();
  const { data, isError, isLoading, isFetching, refetch } = useGetRestaurantsQuery({
    page,
    limit: RESTAURANTS_PER_PAGE,
  });
  const restaurants = data?.items ?? [];
  const total = data?.pagination.total ?? 0;
  const totalPages = Math.max(1, data?.pagination.totalPages ?? 1);
  const openDetailsDialog = (restaurant: RestaurantDto) => {
    setRestaurantDetails(restaurant);
    setDetailsOpened(true);
  };
  const closeDetailsDialog = () => setDetailsOpened(false);
  const openCreateDialog = () => {
    setEditingRestaurant(null);
    setFormOpened(true);
  };
  const openEditDialog = (restaurant: RestaurantDto) => {
    setEditingRestaurant(restaurant);
    setFormOpened(true);
  };
  const closeFormDialog = () => setFormOpened(false);
  const openDeleteDialog = (restaurant: RestaurantDto) => {
    setRestaurantToDelete(restaurant);
    setDeleteDialogOpened(true);
  };
  const closeDeleteDialog = () => {
    if (!isDeleting) setDeleteDialogOpened(false);
  };
  const handleDelete = async () => {
    if (!restaurantToDelete) return;

    try {
      await deleteRestaurant({
        restaurantId: restaurantToDelete.id,
      }).unwrap();
      showSuccessNotification({ message: "Ресторан удалён" });
      setDeleteDialogOpened(false);

      if (restaurants.length === 1 && page > 1) {
        setPage((currentPage) => currentPage - 1);
      }
    } catch {
      // Axios interceptor displays the API error notification.
    }
  };
  const columns: readonly TableColumn<RestaurantDto>[] = [
    ...restaurantColumns,
    {
      key: "actions",
      header: "Действия",
      align: "right",
      mobileLayout: "full",
      render: (restaurant) => (
        <div
          className="grid w-full grid-cols-1 gap-xs md:flex md:w-auto md:flex-nowrap md:justify-end"
          onClick={(event) => event.stopPropagation()}
        >
          <Button
            className="w-full whitespace-nowrap md:w-auto"
            leftSection={<IconEdit aria-hidden="true" size={16} />}
            onClick={() => openEditDialog(restaurant)}
            size="xs"
            variant="ghost"
          >
            Изменить
          </Button>
          <Button
            className="w-full whitespace-nowrap !text-danger hover:!bg-danger-soft md:w-auto"
            leftSection={<IconTrash aria-hidden="true" size={16} />}
            onClick={() => openDeleteDialog(restaurant)}
            size="xs"
            variant="ghost"
          >
            Удалить
          </Button>
        </div>
      ),
      width: 280,
    },
  ];

  return (
    <>
      <AdminPageWrapper className="grid-rows-[auto_minmax(0,1fr)]">
        <div className="flex flex-wrap items-end justify-between gap-md">
          <div>
            <Typography muted variant="eyebrow">
              Управление платформой
            </Typography>
            <Typography className="!text-2xl sm:!text-4xl" variant="h1">
              Рестораны
            </Typography>
          </div>
          <Button
            className="w-full md:w-auto"
            leftSection={<IconPlus aria-hidden="true" size={18} />}
            onClick={openCreateDialog}
          >
            Новый ресторан
          </Button>
        </div>

        <Details
          className="flex min-h-0 flex-col"
          isLoading={isLoading}
          isFetching={isFetching}
          isError={isError}
          errorMessage="Не удалось загрузить рестораны"
          onRetry={refetch}
        >
          <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-xs overflow-hidden">
            <div className="flex justify-end">
              <Typography muted variant="caption">
                Всего: {total}
              </Typography>
            </div>

            <Table
              ariaLabel="Список ресторанов"
              className="[&_[role=list]]:!h-0 [&_[role=list]]:touch-pan-y"
              columns={columns}
              emptyState="Рестораны пока не добавлены"
              getRowAriaLabel={(restaurant) =>
                `Открыть информацию о ресторане ${restaurant.name}`
              }
              getRowKey={(restaurant) => restaurant.id}
              minWidth={930}
              pagination={{
                ariaLabel: "Страницы списка ресторанов",
                onChange: setPage,
                total: totalPages,
                value: page,
                withEdges: true,
              }}
              onRowClick={openDetailsDialog}
              rows={restaurants}
            />
          </div>
        </Details>
      </AdminPageWrapper>

      <RestaurantFormDialog
        onClose={closeFormDialog}
        opened={formOpened}
        restaurant={editingRestaurant}
      />

      <Dialog
        actions={
          <Button onClick={closeDetailsDialog} variant="secondary">
            Закрыть
          </Button>
        }
        description="Полная информация о ресторане."
        icon={<IconBuildingStore size={22} />}
        onClose={closeDetailsDialog}
        onExitTransitionEnd={() => setRestaurantDetails(null)}
        opened={detailsOpened}
        size="lg"
        title={restaurantDetails?.name ?? "Информация о ресторане"}
      >
        {restaurantDetails ? (
          <div className="max-h-[calc(100dvh-16rem)] overflow-y-auto overscroll-contain pr-xs">
            <dl className="m-0 grid grid-cols-1 gap-x-lg gap-y-md sm:grid-cols-2">
              <div className="grid min-w-0 gap-1 sm:col-span-2">
                <dt className="text-xs font-bold text-muted">Название</dt>
                <dd className="m-0 break-words font-extrabold">
                  {restaurantDetails.name}
                </dd>
              </div>
              <div className="grid min-w-0 gap-1">
                <dt className="text-xs font-bold text-muted">Slug</dt>
                <dd className="m-0">
                  <code className="break-all rounded bg-surface-muted px-2 py-1 text-xs text-secondary">
                    {restaurantDetails.slug}
                  </code>
                </dd>
              </div>
              <div className="grid min-w-0 gap-1">
                <dt className="text-xs font-bold text-muted">Статус</dt>
                <dd className="m-0">
                  <Badge
                    tone={statusPresentation[restaurantDetails.status].tone}
                  >
                    {statusPresentation[restaurantDetails.status].label}
                  </Badge>
                </dd>
              </div>
              <div className="grid min-w-0 gap-1 sm:col-span-2">
                <dt className="text-xs font-bold text-muted">ID ресторана</dt>
                <dd className="m-0">
                  <code className="break-all text-xs text-secondary">
                    {restaurantDetails.id}
                  </code>
                </dd>
              </div>
              <div className="grid min-w-0 gap-1">
                <dt className="text-xs font-bold text-muted">Создан</dt>
                <dd className="m-0 font-semibold">
                  <time dateTime={restaurantDetails.createdAt}>
                    {dateTimeFormatter.format(
                      new Date(restaurantDetails.createdAt),
                    )}
                  </time>
                </dd>
              </div>
              <div className="grid min-w-0 gap-1">
                <dt className="text-xs font-bold text-muted">Обновлён</dt>
                <dd className="m-0 font-semibold">
                  <time dateTime={restaurantDetails.updatedAt}>
                    {dateTimeFormatter.format(
                      new Date(restaurantDetails.updatedAt),
                    )}
                  </time>
                </dd>
              </div>
            </dl>
          </div>
        ) : null}
      </Dialog>

      <Dialog
        actions={
          <>
            <Button
              disabled={isDeleting}
              onClick={closeDeleteDialog}
              variant="secondary"
            >
              Отменить
            </Button>
            <Button
              className="!bg-danger hover:!bg-danger-hover"
              leftSection={<IconTrash aria-hidden="true" size={18} />}
              loading={isDeleting}
              onClick={() => void handleDelete()}
            >
              Удалить ресторан
            </Button>
          </>
        }
        closeButtonProps={{ disabled: isDeleting }}
        closeOnClickOutside={!isDeleting}
        closeOnEscape={!isDeleting}
        description="Это действие нельзя отменить. Связанные пользователи ресторана также будут удалены."
        icon={<IconTrash size={22} />}
        onClose={closeDeleteDialog}
        onExitTransitionEnd={() => setRestaurantToDelete(null)}
        opened={deleteDialogOpened}
        title="Удалить ресторан?"
        tone="danger"
      >
        {restaurantToDelete ? (
          <div className="grid gap-xs rounded-lg bg-danger-soft p-md text-sm">
            <strong>{restaurantToDelete.name}</strong>
            <code className="break-all text-danger-active">
              {restaurantToDelete.slug}
            </code>
          </div>
        ) : null}
      </Dialog>
    </>
  );
};

export default SuperAdminRestaurantsPage;
