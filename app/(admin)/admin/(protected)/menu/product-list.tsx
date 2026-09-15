"use client";

import { IconEdit, IconPlus, IconTrash } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";

import type { ProductDto } from "@/api-contracts";
import {
  RestaurantPermissionGate,
  RestaurantPermissionPage,
} from "@/components/admin/restaurant-permission-gate";
import { Details } from "@/components/details";
import {
  Badge,
  Button,
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
import { ROUTES } from "@/config/routes";
import { useRestaurantPermission } from "@/hooks/use-restaurant-permission";
import { useSearchPagination } from "@/hooks/use-search-pagination";
import { useSearchQueryValue } from "@/hooks/use-search-query-value";
import { RESTAURANT_PERMISSION as P } from "@/lib/auth/restaurant-permissions";
import { formatDateTime } from "@/lib/date";
import {
  useDeleteProductMutation,
  useGetProductsQuery,
  useUpdateProductAvailabilityMutation,
} from "@/store/api/products.api";

import { ProductDeleteDialog } from "./product-delete-dialog";
import { ProductImage } from "./product-image";

const PRODUCTS_PER_PAGE = 20;

export function ProductList() {
  const search = useSearchQueryValue();
  const [page, setPage] = useSearchPagination(search);
  const [productToDelete, setProductToDelete] = useState<ProductDto | null>(
    null,
  );
  const [deleteDialogOpened, setDeleteDialogOpened] = useState(false);
  const canManage = useRestaurantPermission(P.MENU_MANAGE);
  const canManageStopList = useRestaurantPermission(P.STOP_LIST_MANAGE);
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const [
    updateProductAvailability,
    { isLoading: isUpdatingAvailability },
  ] = useUpdateProductAvailabilityMutation();
  const { data, isError, isFetching, isLoading, refetch } = useGetProductsQuery(
    {
      page,
      limit: PRODUCTS_PER_PAGE,
      search: search || undefined,
    },
  );
  const products = data?.items ?? [];
  const total = data?.pagination.total ?? 0;
  const totalPages = Math.max(1, data?.pagination.totalPages ?? 1);

  const openDeleteDialog = (product: ProductDto) => {
    setProductToDelete(product);
    setDeleteDialogOpened(true);
  };
  const closeDeleteDialog = () => {
    if (!isDeleting) setDeleteDialogOpened(false);
  };
  const handleDelete = async () => {
    if (!productToDelete) return;

    try {
      await deleteProduct({ productId: productToDelete.id }).unwrap();
      showSuccessNotification({ message: "Продукт удалён" });
      setDeleteDialogOpened(false);

      if (products.length === 1 && page > 1) {
        setPage((currentPage) => currentPage - 1);
      }
    } catch {
      showErrorNotification({ message: "Не удалось удалить продукт" });
    }
  };

  const handleAvailabilityChange = async (
    product: ProductDto,
    isAvailable: boolean,
  ) => {
    try {
      await updateProductAvailability({
        productId: product.id,
        data: { isAvailable },
      }).unwrap();
      showSuccessNotification({
        message: isAvailable
          ? "Продукт возвращён в продажу"
          : "Продукт добавлен в стоп-лист",
      });
    } catch {
      showErrorNotification({
        message: "Не удалось изменить доступность продукта",
      });
    }
  };

  const columns: readonly TableColumn<ProductDto>[] = [
    {
      key: "image",
      header: "Фото",
      mobileLayout: "hidden",
      render: (product) => <ProductImage product={product} />,
      width: 72,
    },
    {
      key: "name",
      header: "Продукт",
      mobileLayout: "primary",
      render: (product) => (
        <div className="grid min-w-0 gap-1">
          <span className="break-words font-extrabold">{product.name}</span>
          {product.baseComposition ? (
            <span className="line-clamp-2 text-xs text-muted">
              {product.baseComposition}
            </span>
          ) : null}
        </div>
      ),
      width: 220,
    },
    {
      key: "category",
      header: "Категория",
      render: (product) => (
        <span className="break-words">{product.category.name}</span>
      ),
      width: 110,
    },
    {
      key: "sortOrder",
      header: "Порядок",
      render: (product) => product.sortOrder,
      width: 80,
    },
    {
      key: "isAvailable",
      header: "Доступность",
      render: (product) => {
        const isAvailable = product.isAvailable;

        return canManageStopList ? (
          <div className="flex items-center gap-xs">
            <Toggle
              aria-label={`${product.name}: доступен для заказа`}
              checked={isAvailable}
              disabled={isUpdatingAvailability}
              onChange={(event) =>
                void handleAvailabilityChange(
                  product,
                  event.currentTarget.checked,
                )
              }
              size="sm"
            />
            <span className="whitespace-nowrap text-xs text-muted">
              {isAvailable ? "В продаже" : "Стоп-лист"}
            </span>
          </div>
        ) : (
          <Badge tone={isAvailable ? "success" : "danger"}>
            {isAvailable ? "Доступен" : "Стоп-лист"}
          </Badge>
        );
      },
      width: 130,
    },
    {
      key: "isPublished",
      header: "Публикация",
      render: (product) => (
        <Badge tone={product.isPublished ? "success" : "neutral"}>
          {product.isPublished ? "Опубликован" : "Скрыт"}
        </Badge>
      ),
      width: 115,
    },
    {
      key: "updatedAt",
      header: "Обновлён",
      mobileFullWidth: true,
      render: (product) => (
        <time className="block text-xs leading-tight" dateTime={product.updatedAt}>
          {formatDateTime(product.updatedAt)}
        </time>
      ),
      width: 145,
    },
    ...(canManage
      ? [
          {
            key: "actions",
            header: "Действия",
            align: "right" as const,
            mobileLayout: "full" as const,
            render: (product: ProductDto) => (
              <div className="grid w-full grid-cols-1 gap-xs md:flex md:w-auto md:flex-nowrap md:justify-end">
                <Button
                  aria-label={`Изменить ${product.name}`}
                  className="w-full whitespace-nowrap md:!size-8 md:!min-w-8 md:!p-0 2xl:!h-8 2xl:!w-auto 2xl:!px-3"
                  component={Link}
                  href={ROUTES.ADMIN.menuEditProduct(product.id)}
                  size="xs"
                  variant="ghost"
                >
                  <IconEdit aria-hidden="true" size={16} />
                  <span className="ml-1 md:sr-only 2xl:not-sr-only">
                    Изменить
                  </span>
                </Button>
                <Button
                  aria-label={`Удалить ${product.name}`}
                  className="w-full whitespace-nowrap !text-danger hover:!bg-danger-soft md:!size-8 md:!min-w-8 md:!p-0 2xl:!h-8 2xl:!w-auto 2xl:!px-3"
                  onClick={() => openDeleteDialog(product)}
                  size="xs"
                  variant="ghost"
                >
                  <IconTrash aria-hidden="true" size={16} />
                  <span className="ml-1 md:sr-only 2xl:not-sr-only">
                    Удалить
                  </span>
                </Button>
              </div>
            ),
            width: 100,
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
                Продукты
              </Typography>
            </div>
            <RestaurantPermissionGate permission={P.MENU_MANAGE}>
              <Button
                className="w-full md:w-auto"
                component={Link}
                href={ROUTES.ADMIN.MENU_CREATE_PRODUCT}
                leftSection={<IconPlus aria-hidden="true" size={18} />}
              >
                Новый продукт
              </Button>
            </RestaurantPermissionGate>
          </div>

          <div className="flex min-h-0 min-w-0 flex-col gap-xs">
            <div className="flex flex-col gap-xs sm:flex-row sm:items-center sm:justify-between">
              <SearchInput
                className="sm:max-w-md"
                placeholder="Найти продукт..."
              />
              <Typography className="text-right" muted variant="caption">
                {search ? "Найдено" : "Всего"}: {total}
              </Typography>
            </div>

            <Details
              className="flex min-h-0 flex-1 flex-col"
              errorMessage="Не удалось загрузить продукты"
              isError={isError}
              isFetching={isFetching}
              isLoading={isLoading}
              onRetry={refetch}
            >
              <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
                <Table
                  ariaLabel="Список продуктов"
                  columns={columns}
                  emptyState={
                    search
                      ? "По вашему запросу продукты не найдены"
                      : "Продукты пока не добавлены"
                  }
                  getRowKey={(product) => product.id}
                  minWidth={canManage ? 1000 : 900}
                  pagination={{
                    ariaLabel: "Страницы списка продуктов",
                    onChange: setPage,
                    total: totalPages,
                    value: page,
                    withEdges: true,
                  }}
                  rows={products}
                  tableProps={{ horizontalSpacing: "sm" }}
                />
              </div>
            </Details>
          </div>
        </section>

        <ProductDeleteDialog
          categoryName={productToDelete?.category.name}
          isDeleting={isDeleting}
          onClose={closeDeleteDialog}
          onConfirm={() => void handleDelete()}
          onExited={() => setProductToDelete(null)}
          opened={deleteDialogOpened}
          product={productToDelete}
        />
      </>
    </RestaurantPermissionPage>
  );
}
