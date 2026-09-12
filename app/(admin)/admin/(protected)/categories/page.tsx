"use client";

import {
  IconCategory,
  IconCategoryPlus,
  IconEdit,
} from "@tabler/icons-react";
import { useState } from "react";

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
  Table,
  Typography,
  type TableColumn,
} from "@/components/ui";
import { RESTAURANT_PERMISSION as P } from "@/lib/auth/restaurant-permissions";
import { useRestaurantPermission } from "@/hooks/use-restaurant-permission";
import {
  useGetCategoriesQuery,
  useGetCategoryQuery,
} from "@/store/api/categories.api";

import { CategoryFormDialog } from "./category-form-dialog";

const CATEGORIES_PER_PAGE = 10;

const dateTimeFormatter = new Intl.DateTimeFormat("ru-RU", {
  dateStyle: "medium",
  timeStyle: "short",
});

const categoryColumns: readonly TableColumn<CategoryDto>[] = [
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
    render: (category) => (category.sortOrder === 0 ? "—" : category.sortOrder),
    width: 120,
  },
  {
    key: "isPublished",
    header: "Публикация",
    render: (category) => (
      <Badge tone={category.isPublished ? "success" : "neutral"}>
        {category.isPublished ? "Опубликована" : "Скрыта"}
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
        {dateTimeFormatter.format(new Date(category.updatedAt))}
      </time>
    ),
    width: 190,
  },
];

export default function CategoriesPage() {
  const [page, setPage] = useState(1);
  const [formOpened, setFormOpened] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<CategoryDto | null>(null);
  const [detailsCategoryId, setDetailsCategoryId] = useState<string | null>(
    null,
  );
  const [detailsOpened, setDetailsOpened] = useState(false);
  const canManage = useRestaurantPermission(P.MENU_MANAGE);
  const { data, isError, isFetching, isLoading, refetch } =
    useGetCategoriesQuery({ page, limit: CATEGORIES_PER_PAGE });
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
  const columns: readonly TableColumn<CategoryDto>[] = canManage
    ? [
        ...categoryColumns,
        {
          key: "actions",
          header: "Действия",
          align: "right",
          mobileLayout: "full",
          render: (category) => (
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
            </div>
          ),
          width: 170,
        },
      ]
    : categoryColumns;

  return (
    <RestaurantPermissionPage permission={P.MENU_READ}>
      <>
        <section className="grid min-h-[calc(100dvh-8rem)] grid-rows-[auto_minmax(0,1fr)] gap-lg">
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

          <Details
            className="flex min-h-0 flex-col"
            errorMessage="Не удалось загрузить категории"
            isError={isError}
            isFetching={isFetching}
            isLoading={isLoading}
            onRetry={refetch}
          >
            <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-xs overflow-hidden">
              <div className="flex justify-end">
                <Typography muted variant="caption">
                  Всего: {total}
                </Typography>
              </div>

              <Table
                ariaLabel="Список категорий"
                className="[&_[role=list]]:!h-0 [&_[role=list]]:touch-pan-y"
                columns={columns}
                emptyState="Категории пока не добавлены"
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
                      tone={
                        categoryDetails.isPublished ? "success" : "neutral"
                      }
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
                      {dateTimeFormatter.format(
                        new Date(categoryDetails.createdAt),
                      )}
                    </time>
                  </dd>
                </div>
                <div className="grid min-w-0 gap-1">
                  <dt className="text-xs font-bold text-muted">Обновлена</dt>
                  <dd className="m-0 font-semibold">
                    <time dateTime={categoryDetails.updatedAt}>
                      {dateTimeFormatter.format(
                        new Date(categoryDetails.updatedAt),
                      )}
                    </time>
                  </dd>
                </div>
              </dl>
            ) : null}
          </Details>
        </Dialog>
      </>
    </RestaurantPermissionPage>
  );
}
