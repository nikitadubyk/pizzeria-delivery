import * as yup from "yup";

import {
  PRODUCT_BASE_COMPOSITION_MAX_LENGTH,
  PRODUCT_DESCRIPTION_MAX_LENGTH,
  PRODUCT_NAME_MAX_LENGTH,
  PRODUCT_SORT_ORDER_MAX,
  PRODUCT_VARIANT_NAME_MAX_LENGTH,
  PRODUCT_VARIANT_PRICE_MAX,
  PRODUCT_VARIANT_WEIGHT_MAX_LENGTH,
  PRODUCT_VARIANTS_MAX_COUNT,
  type CreateProductRequest,
  type ProductDto,
} from "@/api-contracts";

import type {
  ProductFormValues,
  ProductVariantFormValues,
} from "./product-form-page.types";

const PRODUCT_VARIANT_PRICE_MAX_RUBLES = PRODUCT_VARIANT_PRICE_MAX / 100;

export const createEmptyProductVariant = (): ProductVariantFormValues => ({
  name: "",
  price: 0,
  weight: "",
  isAvailable: true,
});

export const getProductFormInitialValues = (
  product: ProductDto | null,
  defaultCategoryId = "",
): ProductFormValues => ({
  categoryId: product?.categoryId ?? defaultCategoryId,
  name: product?.name ?? "",
  description: product?.description ?? "",
  baseComposition: product?.baseComposition ?? "",
  sortOrder: product?.sortOrder ?? 0,
  isPublished: product?.isPublished ?? false,
  image: null,
  removeImage: false,
  variants:
    product?.variants.map((variant) => ({
      id: variant.id,
      name: variant.name ?? "",
      price: variant.price / 100,
      weight: variant.weight ?? "",
      isAvailable: variant.isAvailable,
    })) ?? [],
});

export const getProductRequestData = (
  values: ProductFormValues,
): CreateProductRequest => ({
  categoryId: values.categoryId,
  name: values.name.trim(),
  description: values.description.trim() || null,
  baseComposition: values.baseComposition.trim() || null,
  sortOrder: Number(values.sortOrder),
  isPublished: values.isPublished,
  variants: values.variants.map((variant) => ({
    id: variant.id,
    name: variant.name.trim() || null,
    price: Math.round(Number(variant.price) * 100),
    weight: variant.weight.trim() || null,
    isAvailable: variant.isAvailable,
  })),
});

export const productFormValidationSchema: yup.ObjectSchema<ProductFormValues> =
  yup.object({
    categoryId: yup.string().trim().required("Выберите категорию"),
    name: yup
      .string()
      .trim()
      .max(
        PRODUCT_NAME_MAX_LENGTH,
        `Название не должно превышать ${PRODUCT_NAME_MAX_LENGTH} символов`,
      )
      .required("Введите название продукта"),
    description: yup
      .string()
      .trim()
      .max(
        PRODUCT_DESCRIPTION_MAX_LENGTH,
        `Описание не должно превышать ${PRODUCT_DESCRIPTION_MAX_LENGTH} символов`,
      )
      .ensure(),
    baseComposition: yup
      .string()
      .trim()
      .max(
        PRODUCT_BASE_COMPOSITION_MAX_LENGTH,
        `Состав не должен превышать ${PRODUCT_BASE_COMPOSITION_MAX_LENGTH} символов`,
      )
      .ensure(),
    sortOrder: yup
      .number()
      .typeError("Введите целое число")
      .integer("Порядок должен быть целым числом")
      .min(0, "Порядок не должен быть отрицательным")
      .max(
        PRODUCT_SORT_ORDER_MAX,
        `Порядок не должен превышать ${PRODUCT_SORT_ORDER_MAX}`,
      )
      .required("Введите порядок продукта"),
    isPublished: yup.boolean().required("Укажите статус публикации"),
    image: yup
      .mixed<File>()
      .nullable()
      .defined("Выберите изображение или оставьте поле пустым"),
    removeImage: yup
      .boolean()
      .required("Укажите, нужно ли удалить изображение"),
    variants: yup
      .array()
      .of(
        yup.object({
          id: yup.string().optional(),
          name: yup
            .string()
            .trim()
            .max(
              PRODUCT_VARIANT_NAME_MAX_LENGTH,
              `Название не должно превышать ${PRODUCT_VARIANT_NAME_MAX_LENGTH} символов`,
            )
            .ensure(),
          price: yup
            .number()
            .typeError("Введите цену")
            .min(0, "Цена не должна быть отрицательной")
            .max(
              PRODUCT_VARIANT_PRICE_MAX_RUBLES,
              `Цена не должна превышать ${PRODUCT_VARIANT_PRICE_MAX_RUBLES} ₽`,
            )
            .test(
              "kopecks-precision",
              "Укажите не больше двух знаков после запятой",
              (value) =>
                value === undefined ||
                Math.abs(value * 100 - Math.round(value * 100)) < 1e-8,
            )
            .required("Введите цену"),
          weight: yup
            .string()
            .trim()
            .max(
              PRODUCT_VARIANT_WEIGHT_MAX_LENGTH,
              `Вес или объём не должен превышать ${PRODUCT_VARIANT_WEIGHT_MAX_LENGTH} символов`,
            )
            .ensure(),
          isAvailable: yup.boolean().required("Укажите доступность варианта"),
        }),
      )
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
          variants.every((variant) => Boolean(variant.name.trim())),
      )
      .required("Укажите варианты продукта"),
  });
