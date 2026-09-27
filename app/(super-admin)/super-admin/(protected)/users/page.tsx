"use client";

import { IconEdit, IconPlus, IconTrash, IconUser } from "@tabler/icons-react";
import { Suspense, useState } from "react";
import { Details } from "@/components/details";

import type { RestaurantUserDto, RestaurantUserRole } from "@/api-contracts";
import {
  Badge,
  Button,
  Dialog,
  SearchInput,
  Table,
  Typography,
  type AppBadgeTone,
  type TableColumn,
} from "@/components/ui";
import { showSuccessNotification } from "@/components/ui/notification";
import { useSearchPagination } from "@/hooks/use-search-pagination";
import { useSearchQueryValue } from "@/hooks/use-search-query-value";
import { formatDateTime } from "@/lib/date";
import {
  useDeleteRestaurantUserMutation,
  useGetRestaurantsQuery,
  useGetRestaurantUsersQuery,
} from "@/store/api/super-admin.api";

import { AdminPageWrapper } from "../admin-page-wrapper";
import { UserFormDialog } from "./user-form-dialog";

const USERS_PER_PAGE = 10;
const RESTAURANTS_FOR_SELECT_LIMIT = 100;
const rolePresentation: Record<
  RestaurantUserRole,
  { label: string; tone: AppBadgeTone }
> = {
  OWNER: { label: "Владелец", tone: "primary" },
  EMPLOYEE: { label: "Сотрудник", tone: "info" },
};

const userColumns: readonly TableColumn<RestaurantUserDto>[] = [
  {
    key: "name",
    header: "Пользователь",
    mobileLayout: "primary",
    render: (user) => (
      <span className="font-extrabold break-words md:whitespace-nowrap">
        {user.name ?? "Без имени"}
      </span>
    ),
    width: 180,
  },
  {
    key: "restaurant",
    header: "Ресторан",
    render: (user) => user.restaurant.name,
    width: 180,
  },
  {
    key: "contacts",
    header: "Контакты",
    mobileFullWidth: true,
    render: (user) => (
      <div className="grid gap-1">
        <span className="whitespace-nowrap">{user.phone}</span>
        {user.email ? (
          <span className="text-secondary text-xs break-all">{user.email}</span>
        ) : null}
      </div>
    ),
    width: 210,
  },
  {
    key: "role",
    header: "Роль",
    render: (user) => {
      const role = rolePresentation[user.role];
      return <Badge tone={role.tone}>{role.label}</Badge>;
    },
    width: 130,
  },
  {
    key: "status",
    header: "Статус",
    render: (user) => (
      <Badge tone={user.isActive ? "success" : "neutral"}>
        {user.isActive ? "Активен" : "Отключён"}
      </Badge>
    ),
    width: 130,
  },
  {
    key: "createdAt",
    header: "Создан",
    render: (user) => (
      <time className="whitespace-nowrap" dateTime={user.createdAt}>
        {formatDateTime(user.createdAt)}
      </time>
    ),
    width: 190,
  },
];

const SuperAdminUsersPageContent = () => {
  const search = useSearchQueryValue();
  const [page, setPage] = useSearchPagination(search);
  const [formOpened, setFormOpened] = useState(false);
  const [editingUser, setEditingUser] = useState<RestaurantUserDto | null>(
    null
  );
  const [userToDelete, setUserToDelete] = useState<RestaurantUserDto | null>(
    null
  );
  const [deleteDialogOpened, setDeleteDialogOpened] = useState(false);
  const [userDetails, setUserDetails] = useState<RestaurantUserDto | null>(
    null
  );
  const [detailsOpened, setDetailsOpened] = useState(false);
  const [deleteUser, { isLoading: isDeleting }] =
    useDeleteRestaurantUserMutation();
  const { data, isError, isLoading, isFetching, refetch } =
    useGetRestaurantUsersQuery({
      page,
      limit: USERS_PER_PAGE,
      search: search || undefined,
    });
  const {
    data: restaurantsData,
    isLoading: isRestaurantsLoading,
    isFetching: isRestaurantsFetching,
    isError: isRestaurantsError,
    refetch: refetchRestaurants,
  } = useGetRestaurantsQuery({
    page: 1,
    limit: RESTAURANTS_FOR_SELECT_LIMIT,
  });
  const users = data?.items ?? [];
  const restaurants = restaurantsData?.items ?? [];
  const total = data?.pagination.total ?? 0;
  const totalPages = Math.max(1, data?.pagination.totalPages ?? 1);

  const openDetailsDialog = (user: RestaurantUserDto) => {
    setUserDetails(user);
    setDetailsOpened(true);
  };
  const closeDetailsDialog = () => setDetailsOpened(false);

  const openCreateDialog = () => {
    setEditingUser(null);
    setFormOpened(true);
  };
  const openEditDialog = (user: RestaurantUserDto) => {
    setEditingUser(user);
    setFormOpened(true);
  };
  const closeFormDialog = () => setFormOpened(false);
  const openDeleteDialog = (user: RestaurantUserDto) => {
    setUserToDelete(user);
    setDeleteDialogOpened(true);
  };
  const closeDeleteDialog = () => {
    if (!isDeleting) setDeleteDialogOpened(false);
  };
  const handleDelete = async () => {
    if (!userToDelete) return;

    try {
      await deleteUser({ userId: userToDelete.id }).unwrap();
      showSuccessNotification({ message: "Пользователь удалён" });
      setDeleteDialogOpened(false);

      if (users.length === 1 && page > 1) {
        setPage((currentPage) => currentPage - 1);
      }
    } catch {
      // Axios interceptor displays the API error notification.
    }
  };
  const columns: readonly TableColumn<RestaurantUserDto>[] = [
    ...userColumns,
    {
      key: "actions",
      header: "Действия",
      align: "right",
      mobileLayout: "full",
      render: (user) => (
        <div
          className="gap-xs grid w-full grid-cols-1 md:flex md:w-auto md:flex-nowrap md:justify-end"
          onClick={(event) => event.stopPropagation()}
        >
          <Button
            className="w-full whitespace-nowrap md:w-auto"
            leftSection={<IconEdit aria-hidden="true" size={16} />}
            onClick={() => openEditDialog(user)}
            size="xs"
            variant="ghost"
          >
            Изменить
          </Button>
          <Button
            className="!text-danger hover:!bg-danger-soft w-full whitespace-nowrap md:w-auto"
            leftSection={<IconTrash aria-hidden="true" size={16} />}
            onClick={() => openDeleteDialog(user)}
            size="xs"
            variant="danger"
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
      <AdminPageWrapper className="grid-rows-[auto_auto] md:grid-rows-[auto_minmax(0,1fr)]">
        <div className="gap-md flex flex-wrap items-end justify-between">
          <div>
            <Typography muted variant="eyebrow">
              Управление доступом
            </Typography>
            <Typography className="!text-2xl sm:!text-4xl" variant="h1">
              Пользователи ресторанов
            </Typography>
          </div>
          <Button
            className="w-full md:w-auto"
            disabled={
              restaurants.length === 0 ||
              isRestaurantsFetching ||
              isRestaurantsError
            }
            leftSection={<IconPlus aria-hidden="true" size={18} />}
            onClick={openCreateDialog}
            title={
              restaurants.length === 0 ? "Сначала создайте ресторан" : undefined
            }
          >
            Новый пользователь
          </Button>
        </div>

        <div className="gap-xs flex min-h-0 min-w-0 flex-col">
          <div className="gap-xs flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <SearchInput
              className="sm:max-w-sm"
              placeholder="Найти пользователя..."
            />
            <div className="flex justify-end">
              <Typography muted variant="caption">
                {search ? "Найдено" : "Всего"}: {total}
              </Typography>
            </div>
          </div>

          <Details
            className="flex min-h-0 flex-1 flex-col"
            isLoading={isLoading || isRestaurantsLoading}
            isFetching={isFetching || isRestaurantsFetching}
            isError={isError || isRestaurantsError}
            errorMessage={
              isRestaurantsError
                ? "Не удалось загрузить рестораны"
                : "Не удалось загрузить пользователей"
            }
            onRetry={() => {
              if (isError) void refetch();
              if (isRestaurantsError) void refetchRestaurants();
            }}
          >
            <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
              <Table
                ariaLabel="Список пользователей ресторанов"

                columns={columns}
                emptyState={
                  search
                    ? "По вашему запросу пользователи не найдены"
                    : "Пользователи пока не добавлены"
                }
                getRowAriaLabel={(user) =>
                  `Открыть информацию о пользователе ${user.name ?? "Без имени"}`
                }
                getRowKey={(user) => user.id}
                minWidth={1260}
                pagination={{
                  ariaLabel: "Страницы списка пользователей",
                  onChange: setPage,
                  total: totalPages,
                  value: page,
                  withEdges: true,
                }}
                onRowClick={openDetailsDialog}
                rows={users}
              />
            </div>
          </Details>
        </div>
      </AdminPageWrapper>

      <UserFormDialog
        onClose={closeFormDialog}
        opened={formOpened}
        restaurants={restaurants}
        user={editingUser}
      />

      <Dialog
        actions={
          <Button onClick={closeDetailsDialog} variant="secondary">
            Закрыть
          </Button>
        }
        description="Полная информация о пользователе ресторана."
        icon={<IconUser size={22} />}
        onClose={closeDetailsDialog}
        onExitTransitionEnd={() => setUserDetails(null)}
        opened={detailsOpened}
        size="lg"
        title={userDetails?.name ?? "Информация о пользователе"}
      >
        {userDetails ? (
          <div>
            <dl className="gap-x-lg gap-y-md m-0 grid grid-cols-1 sm:grid-cols-2">
              <div className="grid min-w-0 gap-1 sm:col-span-2">
                <dt className="text-muted text-xs font-bold">Имя</dt>
                <dd className="m-0 font-extrabold break-words">
                  {userDetails.name ?? "Не указано"}
                </dd>
              </div>
              <div className="grid min-w-0 gap-1 sm:col-span-2">
                <dt className="text-muted text-xs font-bold">Ресторан</dt>
                <dd className="m-0 font-semibold">
                  {userDetails.restaurant.name}
                </dd>
              </div>
              <div className="grid min-w-0 gap-1">
                <dt className="text-muted text-xs font-bold">Телефон</dt>
                <dd className="m-0 font-semibold">{userDetails.phone}</dd>
              </div>
              <div className="grid min-w-0 gap-1">
                <dt className="text-muted text-xs font-bold">Email</dt>
                <dd className="m-0 font-semibold break-all">
                  {userDetails.email ?? "Не указан"}
                </dd>
              </div>
              <div className="grid min-w-0 gap-1">
                <dt className="text-muted text-xs font-bold">Роль</dt>
                <dd className="m-0">
                  <Badge tone={rolePresentation[userDetails.role].tone}>
                    {rolePresentation[userDetails.role].label}
                  </Badge>
                </dd>
              </div>
              <div className="grid min-w-0 gap-1">
                <dt className="text-muted text-xs font-bold">Статус</dt>
                <dd className="m-0">
                  <Badge tone={userDetails.isActive ? "success" : "neutral"}>
                    {userDetails.isActive ? "Активен" : "Отключён"}
                  </Badge>
                </dd>
              </div>
              <div className="grid min-w-0 gap-1 sm:col-span-2">
                <dt className="text-muted text-xs font-bold">
                  ID пользователя
                </dt>
                <dd className="m-0">
                  <code className="text-secondary text-xs break-all">
                    {userDetails.id}
                  </code>
                </dd>
              </div>
              <div className="grid min-w-0 gap-1 sm:col-span-2">
                <dt className="text-muted text-xs font-bold">ID ресторана</dt>
                <dd className="m-0">
                  <code className="text-secondary text-xs break-all">
                    {userDetails.restaurantId}
                  </code>
                </dd>
              </div>
              <div className="grid min-w-0 gap-1">
                <dt className="text-muted text-xs font-bold">Создан</dt>
                <dd className="m-0 font-semibold">
                  <time dateTime={userDetails.createdAt}>
                    {formatDateTime(userDetails.createdAt)}
                  </time>
                </dd>
              </div>
              <div className="grid min-w-0 gap-1">
                <dt className="text-muted text-xs font-bold">Обновлён</dt>
                <dd className="m-0 font-semibold">
                  <time dateTime={userDetails.updatedAt}>
                    {formatDateTime(userDetails.updatedAt)}
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
              leftSection={<IconTrash aria-hidden="true" size={18} />}
              loading={isDeleting}
              onClick={() => void handleDelete()}
              variant="danger"
            >
              Удалить пользователя
            </Button>
          </>
        }
        closeButtonProps={{ disabled: isDeleting }}
        closeOnClickOutside={!isDeleting}
        closeOnEscape={!isDeleting}
        description="Это действие нельзя отменить. Пользователь потеряет доступ к панели ресторана."
        icon={<IconTrash size={22} />}
        onClose={closeDeleteDialog}
        onExitTransitionEnd={() => setUserToDelete(null)}
        opened={deleteDialogOpened}
        title="Удалить пользователя?"
        tone="danger"
      >
        {userToDelete ? (
          <div className="gap-xs bg-danger-soft p-md grid rounded-lg text-sm">
            <strong>{userToDelete.name ?? "Без имени"}</strong>
            <span className="text-danger-active">
              {userToDelete.restaurant.name} · {userToDelete.phone}
            </span>
          </div>
        ) : null}
      </Dialog>
    </>
  );
};

const SuperAdminUsersPage = () => (
  <Suspense
    fallback={
      <div
        aria-label="Загрузка списка пользователей"
        className="min-h-[calc(100dvh-8rem)]"
        role="status"
      />
    }
  >
    <SuperAdminUsersPageContent />
  </Suspense>
);

export default SuperAdminUsersPage;
