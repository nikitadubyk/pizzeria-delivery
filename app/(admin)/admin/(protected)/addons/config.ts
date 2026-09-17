import { createElement } from "react";
import * as yup from "yup";
import { ADDON_NAME_MAX_LENGTH, ADDON_PRICE_MAX, type AddonDto, type CreateAddonRequest } from "@/api-contracts";
import type { TableColumn } from "@/components/ui";
import { formatDateTime } from "@/lib/date";
import { formatKopecks } from "@/lib/price";
import { AddonActionsCell, AddonAvailabilityCell } from "./table-cells";
import type { AddonFormValues } from "./types";

const ADDON_PRICE_MAX_RUBLES = ADDON_PRICE_MAX / 100;
export const ADDONS_PER_PAGE = 10;

export const getAddonFormInitialValues = (addon: AddonDto | null): AddonFormValues => ({
  name: addon?.name ?? "",
  price: (addon?.price ?? 0) / 100,
  isAvailable: addon?.isAvailable ?? true,
});

export const getAddonRequestData = (values: AddonFormValues): CreateAddonRequest => ({
  name: values.name.trim(),
  price: Math.round(Number(values.price) * 100),
  isAvailable: values.isAvailable,
});

export const addonFormValidationSchema: yup.ObjectSchema<AddonFormValues> = yup.object({
  name: yup.string().trim()
    .max(ADDON_NAME_MAX_LENGTH, `Название не должно превышать ${ADDON_NAME_MAX_LENGTH} символов`)
    .required("Введите название добавки"),
  price: yup.number().typeError("Введите цену")
    .positive("Цена платной добавки должна быть больше нуля")
    .max(ADDON_PRICE_MAX_RUBLES, `Цена не должна превышать ${ADDON_PRICE_MAX_RUBLES} ₽`)
    .required("Введите цену добавки"),
  isAvailable: yup.boolean().required("Укажите доступность добавки"),
});

type AddonColumnsOptions = {
  canManage: boolean;
  canManageAvailability: boolean;
  isUpdatingAvailability: boolean;
  onAvailabilityChange: (addon: AddonDto, isAvailable: boolean) => void;
  onEdit: (addon: AddonDto) => void;
  onDelete: (addon: AddonDto) => void;
};

export function getAddonColumns({
  canManage,
  canManageAvailability,
  isUpdatingAvailability,
  onAvailabilityChange,
  onEdit,
  onDelete,
}: AddonColumnsOptions): readonly TableColumn<AddonDto>[] {
  return [
    {
      key: "name",
      header: "Название",
      mobileLayout: "primary",
      width: 270,
      render: (addon) => createElement("span", { className: "break-words font-extrabold" }, addon.name),
    },
    {
      key: "price",
      header: "Цена",
      width: 150,
      render: (addon) => formatKopecks(addon.price),
    },
    {
      key: "isAvailable",
      header: "Доступность",
      width: 180,
      render: (addon) => createElement(AddonAvailabilityCell, {
        addon,
        canManage: canManageAvailability,
        isUpdating: isUpdatingAvailability,
        onChange: onAvailabilityChange,
      }),
    },
    {
      key: "updatedAt",
      header: "Обновлена",
      mobileFullWidth: true,
      width: 190,
      render: (addon) => createElement(
        "time",
        { className: "whitespace-nowrap", dateTime: addon.updatedAt },
        formatDateTime(addon.updatedAt),
      ),
    },
    ...(canManage ? [{
      key: "actions",
      header: "Действия",
      align: "right" as const,
      mobileLayout: "full" as const,
      width: 250,
      render: (addon: AddonDto) => createElement(AddonActionsCell, {
        addon,
        onEdit,
        onDelete,
      }),
    }] : []),
  ];
}
