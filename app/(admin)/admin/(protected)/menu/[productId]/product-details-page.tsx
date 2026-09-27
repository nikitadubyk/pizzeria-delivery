"use client";

import { IconArrowLeft, IconEdit, IconTrash } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { RestaurantPermissionGate } from "@/components/admin/restaurant-permission-gate";
import { Details } from "@/components/details";
import { Button, Typography } from "@/components/ui";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@/components/ui/notification";
import { ROUTES } from "@/config/routes";
import { RESTAURANT_PERMISSION as P } from "@/lib/auth/restaurant-permissions";
import { formatDateTime } from "@/lib/date";
import {
  useDeleteProductMutation,
  useGetProductQuery,
} from "@/store/api/products.api";

import { ProductDeleteDialog } from "../product-delete-dialog";
import { ProductContent } from "./product-content";
import type { ProductDetailsPageProps } from "./types";

export function ProductDetailsPage({ productId }: ProductDetailsPageProps) {
  const router = useRouter();
  const [deleteDialogOpened, setDeleteDialogOpened] = useState(false);
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const { data: product, ...queryProps } = useGetProductQuery({ productId });

  const handleDelete = async () => {
    if (!product) return;

    try {
      await deleteProduct({ productId: product.id }).unwrap();
      showSuccessNotification({ message: "Продукт удалён" });
      setDeleteDialogOpened(false);
      router.replace(ROUTES.ADMIN.MENU);
    } catch {
      showErrorNotification({ message: "Не удалось удалить продукт" });
    }
  };

  return (
    <section className="gap-lg pb-lg grid content-start">
      <div className="gap-md flex flex-wrap items-end justify-between">
        <div className="gap-xs grid">
          <Typography muted variant="eyebrow">
            Управление меню
          </Typography>
          <Typography className="!text-2xl sm:!text-4xl" variant="h1">
            {product?.name ?? "Детали продукта"}
          </Typography>
          {product ? (
            <Typography muted variant="caption">
              Обновлён{" "}
              <time dateTime={product.updatedAt}>
                {formatDateTime(product.updatedAt)}
              </time>
            </Typography>
          ) : null}
        </div>
        <div className="gap-sm flex w-full flex-wrap sm:w-auto">
          <Button
            component={Link}
            href={ROUTES.ADMIN.MENU}
            leftSection={<IconArrowLeft aria-hidden="true" size={18} />}
            variant="secondary"
          >
            К списку
          </Button>
          {product ? (
            <RestaurantPermissionGate permission={P.MENU_MANAGE}>
              <Button
                component={Link}
                href={ROUTES.ADMIN.menuEditProduct(product.id)}
                leftSection={<IconEdit aria-hidden="true" size={18} />}
                variant="secondary"
              >
                Редактировать
              </Button>
              <Button
                leftSection={<IconTrash aria-hidden="true" size={18} />}
                onClick={() => setDeleteDialogOpened(true)}
                variant="danger"
              >
                Удалить
              </Button>
            </RestaurantPermissionGate>
          ) : null}
        </div>
      </div>

      <Details
        {...queryProps}
        className="min-h-96"
        errorMessage="Не удалось загрузить продукт"
        onRetry={queryProps.refetch}
      >
        {product ? <ProductContent product={product} /> : null}
      </Details>

      <ProductDeleteDialog
        categoryName={product?.category.name}
        isDeleting={isDeleting}
        onClose={() => {
          if (!isDeleting) setDeleteDialogOpened(false);
        }}
        onConfirm={() => void handleDelete()}
        opened={deleteDialogOpened}
        product={product ?? null}
      />
    </section>
  );
}
