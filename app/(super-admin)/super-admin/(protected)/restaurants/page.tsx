"use client";

import {
  IconBuildingStore,
  IconEdit,
  IconPlus,
  IconRefresh,
  IconTrash,
} from "@tabler/icons-react";
import { useState } from "react";

import type { RestaurantDto, RestaurantStatus } from "@/api-contracts";
import {
  Badge,
  Button,
  Dialog,
  EmptyState,
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

const createdAtFormatter = new Intl.DateTimeFormat("ru-RU", {
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
    render: (restaurant) => (
      <time className="whitespace-nowrap" dateTime={restaurant.createdAt}>
        {createdAtFormatter.format(new Date(restaurant.createdAt))}
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
  const [deleteRestaurant, { isLoading: isDeleting }] =
    useDeleteRestaurantMutation();
  const { data, isError, refetch } = useGetRestaurantsQuery({
    page,
    limit: RESTAURANTS_PER_PAGE,
  });
  const restaurants = data?.items ?? [];
  const total = data?.pagination.total ?? 0;
  const totalPages = Math.max(1, data?.pagination.totalPages ?? 1);
  const openCreateDialog = () => {
    setEditingRestaurant(null);
    setFormOpened(true);
  };
  const openEditDialog = (restaurant: RestaurantDto) => {
    setEditingRestaurant(restaurant);
    setFormOpened(true);
  };
  const closeFormDialog = () => setFormOpened(false);
  const closeDeleteDialog = () => {
    if (!isDeleting) setRestaurantToDelete(null);
  };
  const handleDelete = async () => {
    if (!restaurantToDelete) return;

    try {
      await deleteRestaurant({
        restaurantId: restaurantToDelete.id,
      }).unwrap();
      showSuccessNotification({ message: "Ресторан удалён" });
      setRestaurantToDelete(null);

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
        <div className="grid w-full grid-cols-1 gap-xs md:flex md:w-auto md:flex-nowrap md:justify-end">
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
            onClick={() => setRestaurantToDelete(restaurant)}
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
            <Typography variant="h1">Рестораны</Typography>
          </div>
          <Button
            className="w-full md:w-auto"
            leftSection={<IconPlus aria-hidden="true" size={18} />}
            onClick={openCreateDialog}
          >
            Новый ресторан
          </Button>
        </div>

        {isError ? (
          <EmptyState
            action={
              <Button
                leftSection={<IconRefresh aria-hidden="true" size={18} />}
                onClick={refetch}
              >
                Повторить
              </Button>
            }
            description="Проверьте соединение и попробуйте загрузить список ещё раз."
            icon={<IconBuildingStore size={32} />}
            title="Не удалось загрузить рестораны"
          />
        ) : (
          <div className="flex h-full min-h-0 min-w-0 flex-col gap-xs">
            <div className="flex justify-end">
              <Typography muted variant="caption">
                Всего: {total}
              </Typography>
            </div>

            <Table
              ariaLabel="Список ресторанов"
              className="h-full !min-h-0"
              columns={columns}
              emptyState="Рестораны пока не добавлены"
              getRowKey={(restaurant) => restaurant.id}
              minWidth={930}
              pagination={{
                ariaLabel: "Страницы списка ресторанов",
                onChange: setPage,
                total: totalPages,
                value: page,
                withEdges: true,
              }}
              rows={restaurants}
            />
          </div>
        )}
      </AdminPageWrapper>

      <RestaurantFormDialog
        onClose={closeFormDialog}
        opened={formOpened}
        restaurant={editingRestaurant}
      />

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
        opened={restaurantToDelete !== null}
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
