"use client";

import { IconCategoryPlus } from "@tabler/icons-react";
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
  Table,
  Typography,
  type TableColumn,
} from "@/components/ui";
import { RESTAURANT_PERMISSION as P } from "@/lib/auth/restaurant-permissions";
import { useGetCategoriesQuery } from "@/store/api/categories.api";

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
    render: (category) => category.sortOrder,
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
  const { data, isError, isFetching, isLoading, refetch } =
    useGetCategoriesQuery({ page, limit: CATEGORIES_PER_PAGE });
  const categories = data?.items ?? [];
  const total = data?.pagination.total ?? 0;
  const totalPages = Math.max(1, data?.pagination.totalPages ?? 1);

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
                onClick={() => setFormOpened(true)}
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
                columns={categoryColumns}
                emptyState="Категории пока не добавлены"
                getRowKey={(category) => category.id}
                minWidth={730}
                pagination={{
                  ariaLabel: "Страницы списка категорий",
                  onChange: setPage,
                  total: totalPages,
                  value: page,
                  withEdges: true,
                }}
                rows={categories}
              />
            </div>
          </Details>
        </section>

        <RestaurantPermissionGate permission={P.MENU_MANAGE}>
          <CategoryFormDialog
            onClose={() => setFormOpened(false)}
            onCreated={() => setPage(1)}
            opened={formOpened}
          />
        </RestaurantPermissionGate>
      </>
    </RestaurantPermissionPage>
  );
}
