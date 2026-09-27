"use client";

import { IconTrash } from "@tabler/icons-react";

import type { ProductDto } from "@/api-contracts";
import { Button, Dialog } from "@/components/ui";

type ProductDeleteDialogProps = {
  categoryName?: string;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onExited?: () => void;
  opened: boolean;
  product: ProductDto | null;
};

export function ProductDeleteDialog({
  categoryName,
  isDeleting,
  onClose,
  onConfirm,
  onExited,
  opened,
  product,
}: ProductDeleteDialogProps) {
  return (
    <Dialog
      actions={
        <>
          <Button disabled={isDeleting} onClick={onClose} variant="secondary">
            Отменить
          </Button>
          <Button
            leftSection={<IconTrash aria-hidden="true" size={18} />}
            loading={isDeleting}
            onClick={onConfirm}
            variant="danger"
          >
            Удалить продукт
          </Button>
        </>
      }
      closeButtonProps={{ disabled: isDeleting }}
      closeOnClickOutside={!isDeleting}
      closeOnEscape={!isDeleting}
      description="Продукт и его изображение будут удалены без возможности восстановления."
      icon={<IconTrash size={22} />}
      onClose={onClose}
      onExitTransitionEnd={onExited}
      opened={opened}
      title="Удалить продукт?"
      tone="danger"
    >
      {product ? (
        <div className="gap-xs bg-danger-soft p-md grid rounded-lg text-sm">
          <strong>{product.name}</strong>
          <span className="text-danger-active">
            {categoryName ?? "Без категории"}
          </span>
        </div>
      ) : null}
    </Dialog>
  );
}
