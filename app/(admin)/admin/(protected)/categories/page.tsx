"use client";

import {
  IconCategory,
  IconCategoryPlus,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";
import { Suspense, useState } from "react";

import type { CategoryDto } from "@/api-contracts";
import {
  RestaurantPermissionGate,
  RestaurantPermissionPage,
} from "@/components/admin/restaurant-permission-gate";
import { Details } from "@/components/details";
import {
  Badge,
  Button,
  Dialog,
  SearchInput,
  Table,
  Toggle,
  Typography,
  type TableColumn,
} from "@/components/ui";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@/components/ui/notification";
import { useRestaurantPermission } from "@/hooks/use-restaurant-permission";
import { useSearchPagination } from "@/hooks/use-search-pagination";
import { useSearchQueryValue } from "@/hooks/use-search-query-value";
import { RESTAURANT_PERMISSION as P } from "@/lib/auth/restaurant-permissions";
import { formatDateTime } from "@/lib/date";
import {
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useUpdateCategoryVisibilityMutation,
} from "@/store/api/categories.api";

import { CategoryFormDialog } from "./category-form-dialog";

const CATEGORIES_PER_PAGE = 10;

function CategoriesPage() {
  const search = useSearchQueryValue();
  const [page, setPage] = useSearchPagination(search);
  const [formOpened, setFormOpened] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryDto | null>(
    null,
  );
  const [detailsCategoryId, setDetailsCategoryId] = useState<string | null>(
    null,
  );
  const [detailsOpened, setDetailsOpened] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryDto | null>(
    null,
  );
  const [deleteDialogOpened, setDeleteDialogOpened] = useState(false);
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation();
  const canManage = useRestaurantPermission(P.MENU_MANAGE);
  const canManageVisibility = useRestaurantPermission(P.STOP_LIST_MANAGE);
  const [
    updateCategoryVisibility,
    { isLoading: isUpdatingVisibility },
  ] = useUpdateCategoryVisibilityMutation();
  const { data, isError, isFetching, isLoading, refetch } =
    useGetCategoriesQuery({
      page,
      limit: CATEGORIES_PER_PAGE,
      search: search || undefined,
    });
  const {
    data: categoryDetails,
    isError: isDetailsError,
    isFetching: isDetailsFetching,
    isLoading: isDetailsLoading,
    refetch: refetchDetails,
  } = useGetCategoryQuery(
    { categoryId: detailsCategoryId ?? "" },
    { skip: detailsCategoryId === null },
  );
  const categories = data?.items ?? [];
  const total = data?.pagination.total ?? 0;
  const totalPages = Math.max(1, data?.pagination.totalPages ?? 1);

  const openCreateDialog = () => {
    setEditingCategory(null);
    setFormOpened(true);
  };
  const openEditDialog = (category: CategoryDto) => {
    setEditingCategory(category);
    setFormOpened(true);
  };
  const closeFormDialog = () => setFormOpened(false);
  const openDetailsDialog = (category: CategoryDto) => {
    setDetailsCategoryId(category.id);
    setDetailsOpened(true);
  };
  const closeDetailsDialog = () => setDetailsOpened(false);
  const openDeleteDialog = (category: CategoryDto) => {
    setCategoryToDelete(category);
    setDeleteDialogOpened(true);
  };
  const closeDeleteDialog = () => {
    if (!isDeleting) setDeleteDialogOpened(false);
  };
  const handleDelete = async () => {
    if (!categoryToDelete) return;

    try {
      await deleteCategory({ categoryId: categoryToDelete.id }).unwrap();
      showSuccessNotification({ message: "Категория удалена" });
      setDeleteDialogOpened(false);

      if (categories.length === 1 && page > 1) {
        setPage((currentPage) => currentPage - 1);
      }
    } catch {
      showErrorNotification({
        message:
          "Не удалось удалить категорию. Проверьте, что в ней нет продуктов.",
      });
    }
  };
  const handleVisibilityChange = async (
    category: CategoryDto,
    isPublished: boolean,
  ) => {
    try {
      await updateCategoryVisibility({
        categoryId: category.id,
        data: { isPublished },
      }).unwrap();
      showSuccessNotification({
        message: isPublished ? "Категория показана" : "Категория скрыта",
      });
    } catch {
      showErrorNotification({
        message: "Не удалось изменить видимость категории",
      });
    }
  };
  const columns: readonly TableColumn<CategoryDto>[] = [
    {
      key: "name",
      header: "Название",
      mobileLayout: "primary",
      render: (category) => (
        <span className="break-words font-extrabold">{category.name}</span>
      ),
      width: 260,
    },
    {
      key: "sortOrder",
      header: "Порядок",
      render: (category) =>
        category.sortOrder === 0 ? "—" : category.sortOrder,
      width: 120,
    },
    {
      key: "isPublished",
      header: "Видимость",
      render: (category) =>
        canManageVisibility ? (
          <div
            className="flex items-center gap-xs"
            onClick={(event) => event.stopPropagation()}
          >
            <Toggle
              aria-label={`${category.name}: видна в меню`}
              checked={category.isPublished}
              disabled={isUpdatingVisibility}
              onChange={(event) =>
                void handleVisibilityChange(
                  category,
                  event.currentTarget.checked,
                )
              }
              size="sm"
            />
            <span className="whitespace-nowrap text-xs text-muted">
              {category.isPublished ? "В меню" : "Скрыта"}
            </span>
          </div>
        ) : (
          <Badge tone={category.isPublished ? "success" : "neutral"}>
            {category.isPublished ? "В меню" : "Скрыта"}
          </Badge>
        ),
      width: 160,
    },
    {
      key: "updatedAt",
      header: "Обновлена",
      mobileFullWidth: true,
      render: (category) => (
        <time className="whitespace-nowrap" dateTime={category.updatedAt}>
          {formatDateTime(category.updatedAt)}
        </time>
      ),
      width: 190,
    },
    ...(canManage
      ? [
          {
            key: "actions",
            header: "Действия",
            align: "right" as const,
            mobileLayout: "full" as const,
            render: (category: CategoryDto) => (
              <div
                className="grid w-full grid-cols-1 gap-xs md:flex md:w-auto md:justify-end"
                onClick={(event) => event.stopPropagation()}
              >
                <Button
                  className="w-full whitespace-nowrap md:w-auto"
                  leftSection={<IconEdit aria-hidden="true" size={16} />}
                  onClick={() => openEditDialog(category)}
                  size="xs"
                  variant="ghost"
                >
                  Изменить
                </Button>
                <Button
                  className="w-full whitespace-nowrap !text-danger hover:!bg-danger-soft md:w-auto"
                  leftSection={<IconTrash aria-hidden="true" size={16} />}
                  onClick={() => openDeleteDialog(category)}
                  size="xs"
                  variant="ghost"
                >
                  Удалить
                </Button>
              </div>
            ),
            width: 280,
          },
        ]
      : []),
  ];

  return (
    <RestaurantPermissionPage permission={P.MENU_READ}>
      <>
        <section className="grid min-h-full grid-rows-[auto_auto] gap-lg md:h-full md:min-h-0 md:grid-rows-[auto_minmax(0,1fr)]">
          <div className="flex flex-wrap items-end justify-between gap-md">
            <div>
              <Typography muted variant="eyebrow">
                Управление меню
              </Typography>
              <Typography className="!text-2xl sm:!text-4xl" variant="h1">
                Категории
              </Typography>
            </div>

            <RestaurantPermissionGate permission={P.MENU_MANAGE}>
              <Button
                className="w-full md:w-auto"
                leftSection={<IconCategoryPlus aria-hidden="true" size={18} />}
                onClick={openCreateDialog}
              >
                Новая категория
              </Button>
            </RestaurantPermissionGate>
          </div>

          <div className="flex min-h-0 min-w-0 flex-col gap-xs">
            <div className="flex flex-col gap-xs sm:flex-row sm:items-center sm:justify-between">
              <SearchInput
                className="sm:max-w-sm"
                placeholder="Найти категорию..."
              />
              <div className="flex justify-end">
                <Typography muted variant="caption">
                  {search ? "Найдено" : "Всего"}: {total}
                </Typography>
              </div>
            </div>

            <Details
              className="flex min-h-0 flex-1 flex-col"
              errorMessage="Не удалось загрузить категории"
              isError={isError}
              isFetching={isFetching}
              isLoading={isLoading}
              onRetry={refetch}
            >
              <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
                <Table
                  ariaLabel="Список категорий"

                  columns={columns}
                  emptyState={
                    search
                      ? "По вашему запросу категории не найдены"
                      : "Категории пока не добавлены"
                  }
                  getRowAriaLabel={(category) =>
                    `Открыть информацию о категории ${category.name}`
                  }
                  getRowKey={(category) => category.id}
                  minWidth={canManage ? 900 : 730}
                  pagination={{
                    ariaLabel: "Страницы списка категорий",
                    onChange: setPage,
                    total: totalPages,
                    value: page,
                    withEdges: true,
                  }}
                  onRowClick={openDetailsDialog}
                  rows={categories}
                />
              </div>
            </Details>
          </div>
        </section>

        <RestaurantPermissionGate permission={P.MENU_MANAGE}>
          <CategoryFormDialog
            category={editingCategory}
            onClose={closeFormDialog}
            onCreated={() => setPage(1)}
            opened={formOpened}
          />
        </RestaurantPermissionGate>

        <Dialog
          actions={
            <>
              <Button onClick={closeDetailsDialog} variant="secondary">
                Закрыть
              </Button>
              {canManage && categoryDetails ? (
                <Button
                  leftSection={<IconEdit aria-hidden="true" size={18} />}
                  onClick={() => {
                    closeDetailsDialog();
                    openEditDialog(categoryDetails);
                  }}
                >
                  Изменить
                </Button>
              ) : null}
            </>
          }
          description="Полная информация о категории меню."
          icon={<IconCategory size={22} />}
          onClose={closeDetailsDialog}
          onExitTransitionEnd={() => setDetailsCategoryId(null)}
          opened={detailsOpened}
          size="lg"
          title={categoryDetails?.name ?? "Информация о категории"}
        >
          <Details
            className="min-h-48"
            errorMessage="Не удалось загрузить категорию"
            isError={isDetailsError}
            isFetching={isDetailsFetching}
            isLoading={isDetailsLoading}
            onRetry={refetchDetails}
          >
            {categoryDetails ? (
              <dl className="m-0 grid grid-cols-1 gap-x-lg gap-y-md sm:grid-cols-2">
                <div className="grid min-w-0 gap-1 sm:col-span-2">
                  <dt className="text-xs font-bold text-muted">Название</dt>
                  <dd className="m-0 break-words font-extrabold">
                    {categoryDetails.name}
                  </dd>
                </div>
                <div className="grid min-w-0 gap-1">
                  <dt className="text-xs font-bold text-muted">Порядок</dt>
                  <dd className="m-0 font-semibold">
                    {categoryDetails.sortOrder}
                  </dd>
                </div>
                <div className="grid min-w-0 gap-1">
                  <dt className="text-xs font-bold text-muted">Публикация</dt>
                  <dd className="m-0">
                    <Badge
                      tone={categoryDetails.isPublished ? "success" : "neutral"}
                    >
                      {categoryDetails.isPublished ? "Опубликована" : "Скрыта"}
                    </Badge>
                  </dd>
                </div>
                <div className="grid min-w-0 gap-1 sm:col-span-2">
                  <dt className="text-xs font-bold text-muted">ID категории</dt>
                  <dd className="m-0">
                    <code className="break-all text-xs text-secondary">
                      {categoryDetails.id}
                    </code>
                  </dd>
                </div>
                <div className="grid min-w-0 gap-1">
                  <dt className="text-xs font-bold text-muted">Создана</dt>
                  <dd className="m-0 font-semibold">
                    <time dateTime={categoryDetails.createdAt}>
                      {formatDateTime(categoryDetails.createdAt)}
                    </time>
                  </dd>
                </div>
                <div className="grid min-w-0 gap-1">
                  <dt className="text-xs font-bold text-muted">Обновлена</dt>
                  <dd className="m-0 font-semibold">
                    <time dateTime={categoryDetails.updatedAt}>
                      {formatDateTime(categoryDetails.updatedAt)}
                    </time>
                  </dd>
                </div>
              </dl>
            ) : null}
          </Details>
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
                Удалить категорию
              </Button>
            </>
          }
          closeButtonProps={{ disabled: isDeleting }}
          closeOnClickOutside={!isDeleting}
          closeOnEscape={!isDeleting}
          description="Категорию можно удалить, только если в ней нет продуктов."
          icon={<IconTrash size={22} />}
          onClose={closeDeleteDialog}
          onExitTransitionEnd={() => setCategoryToDelete(null)}
          opened={deleteDialogOpened}
          title="Удалить категорию?"
          tone="danger"
        >
          {categoryToDelete ? (
            <div className="rounded-lg bg-danger-soft p-md text-sm">
              <strong>{categoryToDelete.name}</strong>
            </div>
          ) : null}
        </Dialog>
      </>
    </RestaurantPermissionPage>
  );
}

export default function CategoriesPageRoute() {
  return (
    <Suspense
      fallback={
        <div
          aria-label="Загрузка списка категорий"
          className="h-full min-h-0"
          role="status"
        />
      }
    >
      <CategoriesPage />
    </Suspense>
  );
}
