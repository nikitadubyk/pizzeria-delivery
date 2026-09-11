import {
  CATEGORY_LIST_DEFAULT_LIMIT,
  CATEGORY_LIST_MAX_LIMIT,
  CATEGORY_NAME_MAX_LENGTH,
  CATEGORY_SORT_ORDER_MAX,
} from "@/api-contracts";
import * as yup from "yup";

const nameSchema = yup
  .string()
  .trim()
  .max(
    CATEGORY_NAME_MAX_LENGTH,
    `Название категории не должно превышать ${CATEGORY_NAME_MAX_LENGTH} символов`,
  )
  .required("Название категории обязательно");

const sortOrderSchema = yup
  .number()
  .integer("Порядок категории должен быть целым числом")
  .min(0, "Порядок категории не должен быть отрицательным")
  .max(
    CATEGORY_SORT_ORDER_MAX,
    `Порядок категории не должен превышать ${CATEGORY_SORT_ORDER_MAX}`,
  );

const isPublishedSchema = yup.boolean();

export const categoryListQuerySchema = yup.object({
  page: yup
    .number()
    .integer("Номер страницы должен быть целым числом")
    .min(1, "Номер страницы должен быть не меньше 1")
    .default(1),
  limit: yup
    .number()
    .integer("Размер страницы должен быть целым числом")
    .min(1, "Размер страницы должен быть не меньше 1")
    .max(
      CATEGORY_LIST_MAX_LIMIT,
      `Размер страницы не должен превышать ${CATEGORY_LIST_MAX_LIMIT}`,
    )
    .default(CATEGORY_LIST_DEFAULT_LIMIT),
});

export const categoryPathParamsSchema = yup.object({
  categoryId: yup
    .string()
    .trim()
    .required("Идентификатор категории обязателен"),
});

export const createCategoryRequestSchema = yup.object({
  name: nameSchema,
  sortOrder: sortOrderSchema.optional(),
  isPublished: isPublishedSchema.optional(),
});

export const updateCategoryRequestSchema = yup
  .object({
    name: nameSchema.optional(),
    sortOrder: sortOrderSchema.optional(),
    isPublished: isPublishedSchema.optional(),
  })
  .test(
    "at-least-one-field",
    "Передайте хотя бы одно поле для обновления",
    (value) =>
      value.name !== undefined ||
      value.sortOrder !== undefined ||
      value.isPublished !== undefined,
  );
