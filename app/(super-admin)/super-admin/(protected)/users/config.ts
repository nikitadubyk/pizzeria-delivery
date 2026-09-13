import * as yup from "yup";

import {
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
  RESTAURANT_USER_ROLES,
  USER_EMAIL_MAX_LENGTH,
  USER_NAME_MAX_LENGTH,
  USER_PHONE_PATTERN,
  type RestaurantDto,
  type RestaurantUserDto,
  type RestaurantUserRole,
} from "@/api-contracts";

import type { UserFormValues } from "./types";

export const USER_FORM_ID = "restaurant-user-form";

export const userRoleOptions: {
  label: string;
  value: RestaurantUserRole;
}[] = [
  { label: "Владелец", value: "OWNER" },
  { label: "Сотрудник", value: "EMPLOYEE" },
];

export const getUserFormValidationSchema = (
  isEditing: boolean,
): yup.ObjectSchema<UserFormValues> =>
  yup.object({
    restaurantId: yup.string().trim().required("Выберите ресторан"),
    name: yup
      .string()
      .trim()
      .max(
        USER_NAME_MAX_LENGTH,
        `Имя не должно превышать ${USER_NAME_MAX_LENGTH} символов`,
      )
      .required("Введите имя пользователя"),
    phone: yup
      .string()
      .matches(USER_PHONE_PATTERN, "Введите корректный номер телефона")
      .required("Введите телефон"),
    email: yup
      .string()
      .trim()
      .lowercase()
      .email("Введите корректный email")
      .max(
        USER_EMAIL_MAX_LENGTH,
        `Email не должен превышать ${USER_EMAIL_MAX_LENGTH} символов`,
      )
      .ensure(),
    password: yup
      .string()
      .max(
        MAX_PASSWORD_LENGTH,
        `Пароль не должен превышать ${MAX_PASSWORD_LENGTH} символов`,
      )
      .test(
        "password-required-or-long-enough",
        `Пароль должен содержать не менее ${MIN_PASSWORD_LENGTH} символов`,
        (value) =>
          isEditing
            ? !value || value.length >= MIN_PASSWORD_LENGTH
            : Boolean(value && value.length >= MIN_PASSWORD_LENGTH),
      )
      .ensure(),
    role: yup
      .mixed<RestaurantUserRole>()
      .oneOf(RESTAURANT_USER_ROLES, "Выберите корректную роль")
      .required("Выберите роль"),
    isActive: yup.boolean().required("Укажите статус пользователя"),
  });

export const getUserFormInitialValues = (
  user: RestaurantUserDto | null,
  restaurants: readonly RestaurantDto[],
): UserFormValues => ({
  restaurantId: user?.restaurantId ?? restaurants[0]?.id ?? "",
  name: user?.name ?? "",
  phone: user?.phone ?? "",
  email: user?.email ?? "",
  password: "",
  role: user?.role ?? "EMPLOYEE",
  isActive: user?.isActive ?? true,
});

export const getRestaurantOptions = (
  user: RestaurantUserDto | null,
  restaurants: readonly RestaurantDto[],
) => [
  ...restaurants.map((restaurant) => ({
    label: restaurant.name,
    value: restaurant.id,
  })),
  ...(user &&
  !restaurants.some((restaurant) => restaurant.id === user.restaurantId)
    ? [{ label: user.restaurant.name, value: user.restaurantId }]
    : []),
];
