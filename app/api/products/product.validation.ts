import {
  PRODUCT_BASE_COMPOSITION_MAX_LENGTH,
  PRODUCT_DESCRIPTION_MAX_LENGTH,
  PRODUCT_LIST_DEFAULT_LIMIT,
  PRODUCT_LIST_MAX_LIMIT,
  PRODUCT_NAME_MAX_LENGTH,
  PRODUCT_SORT_ORDER_MAX,
} from "@/api-contracts";
import { createSearchPaginationSchema } from "@/app/api/common/list-query";
import * as yup from "yup";

const requiredIdSchema = (message: string) =>
  yup.string().trim().required(message);

const nullableTextSchema = (maxLength: number, message: string) =>
  yup
    .string()
    .trim()
    .max(maxLength, message)
    .transform((value) => (value === "" ? null : value))
    .nullable();

const sortOrderSchema = yup
  .number()
  .integer("Порядок продукта должен быть целым числом")
  .min(0, "Порядок продукта не должен быть отрицательным")
  .max(
    PRODUCT_SORT_ORDER_MAX,
    `Порядок продукта не должен превышать ${PRODUCT_SORT_ORDER_MAX}`,
  );

const productFields = {
  categoryId: requiredIdSchema("Категория продукта обязательна"),
  name: yup
    .string()
    .trim()
    .max(
      PRODUCT_NAME_MAX_LENGTH,
      `Название продукта не должно превышать ${PRODUCT_NAME_MAX_LENGTH} символов`,
    )
    .required("Название продукта обязательно"),
  description: nullableTextSchema(
    PRODUCT_DESCRIPTION_MAX_LENGTH,
    `Описание не должно превышать ${PRODUCT_DESCRIPTION_MAX_LENGTH} символов`,
  ),
  baseComposition: nullableTextSchema(
    PRODUCT_BASE_COMPOSITION_MAX_LENGTH,
    `Базовый состав не должен превышать ${PRODUCT_BASE_COMPOSITION_MAX_LENGTH} символов`,
  ),
  sortOrder: sortOrderSchema,
  isPublished: yup.boolean(),
};

export const productListQuerySchema = createSearchPaginationSchema({
  defaultLimit: PRODUCT_LIST_DEFAULT_LIMIT,
  maxLimit: PRODUCT_LIST_MAX_LIMIT,
}).shape({
  categoryId: yup.string().trim().optional(),
  isPublished: yup.boolean().optional(),
});

export const productPathParamsSchema = yup.object({
  productId: requiredIdSchema("Идентификатор продукта обязателен"),
});

export const createProductRequestSchema = yup.object({
  ...productFields,
  description: productFields.description.optional(),
  baseComposition: productFields.baseComposition.optional(),
  sortOrder: productFields.sortOrder.optional(),
  isPublished: productFields.isPublished.optional(),
});

export const updateProductRequestSchema = yup
  .object({
    categoryId: productFields.categoryId.optional(),
    name: productFields.name.optional(),
    description: productFields.description.optional(),
    baseComposition: productFields.baseComposition.optional(),
    sortOrder: productFields.sortOrder.optional(),
    isPublished: productFields.isPublished.optional(),
  })
  .test(
    "at-least-one-field",
    "Передайте хотя бы одно поле для обновления",
    (value) => Object.values(value).some((field) => field !== undefined),
  );
