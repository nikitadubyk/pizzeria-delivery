import {
  PRODUCT_BASE_COMPOSITION_MAX_LENGTH,
  PRODUCT_DESCRIPTION_MAX_LENGTH,
  PRODUCT_LIST_DEFAULT_LIMIT,
  PRODUCT_LIST_MAX_LIMIT,
  PRODUCT_NAME_MAX_LENGTH,
  PRODUCT_SORT_ORDER_MAX,
  PRODUCT_VARIANT_NAME_MAX_LENGTH,
  PRODUCT_VARIANT_PRICE_MAX,
  PRODUCT_VARIANT_WEIGHT_MAX_LENGTH,
  PRODUCT_VARIANTS_MAX_COUNT,
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

const productVariantSchema = yup.object({
  id: yup.string().trim().optional(),
  name: nullableTextSchema(
    PRODUCT_VARIANT_NAME_MAX_LENGTH,
    `Название варианта не должно превышать ${PRODUCT_VARIANT_NAME_MAX_LENGTH} символов`,
  ).optional(),
  price: yup
    .number()
    .typeError("Цена варианта должна быть числом")
    .integer("Цена варианта должна быть указана в копейках")
    .min(0, "Цена варианта не должна быть отрицательной")
    .max(
      PRODUCT_VARIANT_PRICE_MAX,
      `Цена варианта не должна превышать ${PRODUCT_VARIANT_PRICE_MAX} копеек`,
    )
    .required("Цена варианта обязательна"),
  weight: nullableTextSchema(
    PRODUCT_VARIANT_WEIGHT_MAX_LENGTH,
    `Вес или объём не должен превышать ${PRODUCT_VARIANT_WEIGHT_MAX_LENGTH} символов`,
  ).optional(),
  isAvailable: yup.boolean().optional(),
});

const productVariantsSchema = yup
  .array()
  .of(productVariantSchema)
  .max(
    PRODUCT_VARIANTS_MAX_COUNT,
    `Нельзя добавить больше ${PRODUCT_VARIANTS_MAX_COUNT} вариантов`,
  )
  .test(
    "named-multiple-variants",
    "Укажите название для каждого варианта, если их больше одного",
    (variants) =>
      !variants ||
      variants.length <= 1 ||
      variants.every((variant) => Boolean(variant.name?.trim())),
  )
  .test(
    "unique-variant-ids",
    "Один и тот же вариант передан несколько раз",
    (variants) => {
      if (!variants) return true;
      const ids = variants.flatMap((variant) =>
        variant.id ? [variant.id] : [],
      );
      return new Set(ids).size === ids.length;
    },
  );

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

export const updateProductAvailabilityRequestSchema = yup.object({
  isAvailable: yup.boolean().required("Укажите доступность продукта"),
});

export const createProductRequestSchema = yup.object({
  ...productFields,
  description: productFields.description.optional(),
  baseComposition: productFields.baseComposition.optional(),
  sortOrder: productFields.sortOrder.optional(),
  isPublished: productFields.isPublished.optional(),
  variants: productVariantsSchema.required("Варианты продукта обязательны"),
});

export const updateProductRequestSchema = yup
  .object({
    categoryId: productFields.categoryId.optional(),
    name: productFields.name.optional(),
    description: productFields.description.optional(),
    baseComposition: productFields.baseComposition.optional(),
    sortOrder: productFields.sortOrder.optional(),
    isPublished: productFields.isPublished.optional(),
    variants: productVariantsSchema.optional(),
  })
  .test(
    "at-least-one-field",
    "Передайте хотя бы одно поле для обновления",
    (value) => Object.values(value).some((field) => field !== undefined),
  );
