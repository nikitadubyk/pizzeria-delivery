import * as yup from "yup";

import {
  RESTAURANT_NAME_MAX_LENGTH,
  RESTAURANT_SLUG_MAX_LENGTH,
  RESTAURANT_SLUG_PATTERN,
  RESTAURANT_STATUSES,
  type RestaurantDto,
  type RestaurantStatus,
} from "@/api-contracts";

import type { RestaurantFormValues } from "./restaurant-form-dialog.types";

export const RESTAURANT_FORM_ID = "restaurant-form";

export const restaurantStatusOptions: {
  label: string;
  value: RestaurantStatus;
}[] = [
  { label: "Активен", value: "ACTIVE" },
  { label: "Приостановлен", value: "SUSPENDED" },
  { label: "В архиве", value: "ARCHIVED" },
];

export const restaurantFormValidationSchema: yup.ObjectSchema<RestaurantFormValues> =
  yup.object({
    name: yup
      .string()
      .trim()
      .max(
        RESTAURANT_NAME_MAX_LENGTH,
        `Название не должно превышать ${RESTAURANT_NAME_MAX_LENGTH} символов`,
      )
      .required("Введите название ресторана"),
    slug: yup
      .string()
      .trim()
      .lowercase()
      .max(
        RESTAURANT_SLUG_MAX_LENGTH,
        `Slug не должен превышать ${RESTAURANT_SLUG_MAX_LENGTH} символов`,
      )
      .matches(
        RESTAURANT_SLUG_PATTERN,
        "Используйте строчные латинские буквы, цифры и одиночные дефисы",
      )
      .required("Введите slug ресторана"),
    status: yup
      .mixed<RestaurantStatus>()
      .oneOf(RESTAURANT_STATUSES, "Выберите корректный статус")
      .required("Выберите статус"),
  });

export const getRestaurantFormInitialValues = (
  restaurant: RestaurantDto | null,
): RestaurantFormValues => ({
  name: restaurant?.name ?? "",
  slug: restaurant?.slug ?? "",
  status: restaurant?.status ?? "ACTIVE",
});
