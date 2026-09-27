"use client";

import { IconTrash } from "@tabler/icons-react";
import type { AddonDto } from "@/api-contracts";
import { Button, Dialog } from "@/components/ui";

type DeleteDialogProps = {
  addon: AddonDto | null;
  isDeleting: boolean;
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onExitTransitionEnd: () => void;
};

export function DeleteDialog({
  addon,
  isDeleting,
  opened,
  onClose,
  onConfirm,
  onExitTransitionEnd,
}: DeleteDialogProps) {
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
            Удалить добавку
          </Button>
        </>
      }
      closeButtonProps={{ disabled: isDeleting }}
      closeOnClickOutside={!isDeleting}
      closeOnEscape={!isDeleting}
      description="Добавка будет удалена без возможности восстановления."
      icon={<IconTrash size={22} />}
      onClose={onClose}
      onExitTransitionEnd={onExitTransitionEnd}
      opened={opened}
      title="Вы точно хотите удалить эту добавку?"
      tone="danger"
    >
      {addon ? (
        <div className="bg-danger-soft p-md rounded-lg text-sm">
          <strong>{addon.name}</strong>
        </div>
      ) : null}
    </Dialog>
  );
}
