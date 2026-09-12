import {
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
  RESTAURANT_USER_ROLES,
  USER_EMAIL_MAX_LENGTH,
  USER_LIST_DEFAULT_LIMIT,
  USER_LIST_MAX_LIMIT,
  USER_NAME_MAX_LENGTH,
  USER_PHONE_PATTERN,
} from "@/api-contracts";
import { createSearchPaginationSchema } from "@/app/api/common/list-query";
import * as yup from "yup";

const nameSchema = yup
  .string()
  .trim()
  .max(
    USER_NAME_MAX_LENGTH,
    `Имя не должно превышать ${USER_NAME_MAX_LENGTH} символов`,
  )
  .required("Имя пользователя обязательно");

const passwordSchema = yup
  .string()
  .min(
    MIN_PASSWORD_LENGTH,
    `Пароль должен содержать не менее ${MIN_PASSWORD_LENGTH} символов`,
  )
  .max(
    MAX_PASSWORD_LENGTH,
    `Пароль не должен превышать ${MAX_PASSWORD_LENGTH} символов`,
  )
  .required("Пароль обязателен");

export const superAdminLoginRequestSchema = yup.object({
  email: yup
    .string()
    .trim()
    .lowercase()
    .email("Введите корректный email")
    .required("Введите email"),
  password: yup
    .string()
    .min(
      MIN_PASSWORD_LENGTH,
      `Пароль должен содержать не менее ${MIN_PASSWORD_LENGTH} символов`,
    )
    .required("Введите пароль"),
});

export const superAdminRefreshRequestSchema = yup.object({
  refreshToken: yup.string().trim().required("Refresh token обязателен"),
});

export const authorizationHeaderSchema = yup.object({
  authorization: yup
    .string()
    .trim()
    .matches(/^Bearer \S+$/, "Требуется авторизация")
    .required("Требуется авторизация"),
});

export const restaurantUserListQuerySchema = createSearchPaginationSchema({
  defaultLimit: USER_LIST_DEFAULT_LIMIT,
  maxLimit: USER_LIST_MAX_LIMIT,
});

export const restaurantUserPathParamsSchema = yup.object({
  userId: yup.string().trim().required("Идентификатор пользователя обязателен"),
});

const restaurantIdSchema = yup.string().trim().required("Выберите ресторан");

const phoneSchema = yup
  .string()
  .trim()
  .matches(USER_PHONE_PATTERN, "Введите корректный номер телефона")
  .required("Телефон обязателен");

const optionalEmailSchema = yup
  .string()
  .nullable()
  .trim()
  .lowercase()
  .transform((value) => (value === "" ? null : value))
  .email("Введите корректный email")
  .max(
    USER_EMAIL_MAX_LENGTH,
    `Email не должен превышать ${USER_EMAIL_MAX_LENGTH} символов`,
  )
  .optional();

const restaurantUserRoleSchema = yup
  .mixed<(typeof RESTAURANT_USER_ROLES)[number]>()
  .oneOf(RESTAURANT_USER_ROLES, "Выберите корректную роль")
  .required("Роль обязательна");

export const createRestaurantUserRequestSchema = yup.object({
  restaurantId: restaurantIdSchema,
  name: nameSchema,
  phone: phoneSchema,
  email: optionalEmailSchema,
  password: passwordSchema,
  role: restaurantUserRoleSchema,
  isActive: yup.boolean().optional(),
});

export const updateRestaurantUserRequestSchema = yup
  .object({
    restaurantId: restaurantIdSchema.optional(),
    name: nameSchema.optional(),
    phone: phoneSchema.optional(),
    email: optionalEmailSchema,
    password: passwordSchema.optional(),
    role: restaurantUserRoleSchema.optional(),
    isActive: yup.boolean().optional(),
  })
  .test(
    "at-least-one-field",
    "Передайте хотя бы одно поле для обновления",
    (value) =>
      value.restaurantId !== undefined ||
      value.name !== undefined ||
      value.phone !== undefined ||
      value.email !== undefined ||
      value.password !== undefined ||
      value.role !== undefined ||
      value.isActive !== undefined,
  );
