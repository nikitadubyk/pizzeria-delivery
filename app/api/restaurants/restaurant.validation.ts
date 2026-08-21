import {
  RESTAURANT_NAME_MAX_LENGTH,
  RESTAURANT_SLUG_MAX_LENGTH,
  RESTAURANT_SLUG_PATTERN,
  RESTAURANT_STATUSES,
} from "@/app/api/restaurants/config";
import * as yup from "yup";

const nameSchema = yup
  .string()
  .trim()
  .max(
    RESTAURANT_NAME_MAX_LENGTH,
    `Название ресторана не должно превышать ${RESTAURANT_NAME_MAX_LENGTH} символов`,
  )
  .required("Название ресторана обязательно");

const slugSchema = yup
  .string()
  .trim()
  .lowercase()
  .max(
    RESTAURANT_SLUG_MAX_LENGTH,
    `Slug ресторана не должен превышать ${RESTAURANT_SLUG_MAX_LENGTH} символов`,
  )
  .matches(
    RESTAURANT_SLUG_PATTERN,
    "Slug должен содержать только латинские строчные буквы, цифры и одиночные дефисы",
  )
  .required("Slug ресторана обязателен");

const statusSchema = yup
  .mixed<(typeof RESTAURANT_STATUSES)[number]>()
  .oneOf(RESTAURANT_STATUSES, "Некорректный статус ресторана");

export const restaurantPathParamsSchema = yup.object({
  restaurantId: yup
    .string()
    .trim()
    .required("Идентификатор ресторана обязателен"),
});

export const createRestaurantRequestSchema = yup.object({
  name: nameSchema,
  slug: slugSchema,
  status: statusSchema.optional(),
});

export const updateRestaurantRequestSchema = yup
  .object({
    name: nameSchema.optional(),
    slug: slugSchema.optional(),
    status: statusSchema.optional(),
  })
  .test(
    "at-least-one-field",
    "Передайте хотя бы одно поле для обновления",
    (value) =>
      value.name !== undefined ||
      value.slug !== undefined ||
      value.status !== undefined,
  );
