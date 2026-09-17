"use client";

import { IconEdit, IconTrash } from "@tabler/icons-react";
import type { AddonDto } from "@/api-contracts";
import { Badge, Button, Toggle } from "@/components/ui";

type AddonAvailabilityCellProps = {
  addon: AddonDto;
  canManage: boolean;
  isUpdating: boolean;
  onChange: (addon: AddonDto, isAvailable: boolean) => void;
};

export function AddonAvailabilityCell({
  addon,
  canManage,
  isUpdating,
  onChange,
}: AddonAvailabilityCellProps) {
  if (!canManage) {
    return (
      <Badge tone={addon.isAvailable ? "success" : "danger"}>
        {addon.isAvailable ? "Доступна" : "Стоп-лист"}
      </Badge>
    );
  }

  return (
    <div className="flex items-center gap-xs" onClick={(event) => event.stopPropagation()}>
      <Toggle
        aria-label={addon.name + ": доступна для заказа"}
        checked={addon.isAvailable}
        disabled={isUpdating}
        onChange={(event) => onChange(addon, event.currentTarget.checked)}
        size="sm"
      />
      <span className="whitespace-nowrap text-xs text-muted">
        {addon.isAvailable ? "Доступна" : "Стоп-лист"}
      </span>
    </div>
  );
}

type AddonActionsCellProps = {
  addon: AddonDto;
  onEdit: (addon: AddonDto) => void;
  onDelete: (addon: AddonDto) => void;
};

export function AddonActionsCell({ addon, onEdit, onDelete }: AddonActionsCellProps) {
  return (
    <div className="grid w-full grid-cols-1 gap-xs md:flex md:w-auto md:justify-end" onClick={(event) => event.stopPropagation()}>
      <Button className="w-full md:w-auto" leftSection={<IconEdit aria-hidden="true" size={16} />}
        onClick={() => onEdit(addon)} size="xs" variant="ghost">Изменить</Button>
      <Button className="w-full md:w-auto" leftSection={<IconTrash aria-hidden="true" size={16} />}
        onClick={() => onDelete(addon)} size="xs" variant="danger">Удалить</Button>
    </div>
  );
}
