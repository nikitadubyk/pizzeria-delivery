import { ADDON_LIST_DEFAULT_LIMIT, ADDON_LIST_MAX_LIMIT, ADDON_NAME_MAX_LENGTH, ADDON_PRICE_MAX } from "@/api-contracts";
import { createSearchPaginationSchema } from "@/app/api/common/list-query";
import * as yup from "yup";

const nameSchema = yup.string().trim()
  .max(ADDON_NAME_MAX_LENGTH, `Название не должно превышать ${ADDON_NAME_MAX_LENGTH} символов`)
  .required("Название добавки обязательно");

const priceSchema = yup.number()
  .typeError("Цена добавки должна быть числом")
  .integer("Цена добавки должна быть указана в копейках")
  .min(1, "Цена платной добавки должна быть больше нуля")
  .max(ADDON_PRICE_MAX, `Цена не должна превышать ${ADDON_PRICE_MAX} копеек`)
  .required("Цена добавки обязательна");

export const addonListQuerySchema = createSearchPaginationSchema({
  defaultLimit: ADDON_LIST_DEFAULT_LIMIT,
  maxLimit: ADDON_LIST_MAX_LIMIT,
});

export const addonPathParamsSchema = yup.object({
  addonId: yup.string().trim().required("Идентификатор добавки обязателен"),
});

export const createAddonRequestSchema = yup.object({
  name: nameSchema,
  price: priceSchema,
  isAvailable: yup.boolean().optional(),
});

export const updateAddonRequestSchema = yup.object({
  name: nameSchema.optional(),
  price: priceSchema.optional(),
  isAvailable: yup.boolean().optional(),
}).test("at-least-one-field", "Передайте хотя бы одно поле для обновления", (value) =>
  Object.values(value).some((field) => field !== undefined),
);

export const updateAddonAvailabilityRequestSchema = yup.object({
  isAvailable: yup.boolean().required("Укажите доступность добавки"),
});
