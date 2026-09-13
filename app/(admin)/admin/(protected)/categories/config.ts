import * as yup from "yup";

import {
  CATEGORY_NAME_MAX_LENGTH,
  CATEGORY_SORT_ORDER_MAX,
  type CategoryDto,
} from "@/api-contracts";

import type { CategoryFormValues } from "./types";

export const CATEGORY_FORM_ID = "category-form";

export const getCategoryFormInitialValues = (
  category: CategoryDto | null,
): CategoryFormValues => ({
  name: category?.name ?? "",
  sortOrder: category?.sortOrder ?? 0,
  isPublished: category?.isPublished ?? false,
});

export const categoryFormValidationSchema: yup.ObjectSchema<CategoryFormValues> =
  yup.object({
    name: yup
      .string()
      .trim()
      .max(
        CATEGORY_NAME_MAX_LENGTH,
        `Название не должно превышать ${CATEGORY_NAME_MAX_LENGTH} символов`,
      )
      .required("Введите название категории"),
    sortOrder: yup
      .number()
      .typeError("Введите целое число")
      .integer("Порядок должен быть целым числом")
      .min(0, "Порядок не должен быть отрицательным")
      .max(
        CATEGORY_SORT_ORDER_MAX,
        `Порядок не должен превышать ${CATEGORY_SORT_ORDER_MAX}`,
      )
      .required("Введите порядок категории"),
    isPublished: yup.boolean().required("Укажите статус публикации"),
  });
