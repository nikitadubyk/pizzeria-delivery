import * as yup from "yup";

import {
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
  USER_EMAIL_MAX_LENGTH,
  USER_NAME_MAX_LENGTH,
  USER_PHONE_PATTERN,
  type EmployeeDto,
} from "@/api-contracts";

import type { EmployeeFormValues } from "./types";

export const getEmployeeFormValidationSchema = (
  isEditing: boolean
): yup.ObjectSchema<EmployeeFormValues> =>
  yup.object({
    name: yup
      .string()
      .trim()
      .max(
        USER_NAME_MAX_LENGTH,
        `Имя не должно превышать ${USER_NAME_MAX_LENGTH} символов`
      )
      .required("Введите имя сотрудника"),
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
        `Email не должен превышать ${USER_EMAIL_MAX_LENGTH} символов`
      )
      .ensure(),
    password: yup
      .string()
      .max(
        MAX_PASSWORD_LENGTH,
        `Пароль не должен превышать ${MAX_PASSWORD_LENGTH} символов`
      )
      .test(
        "password-required-on-create",
        `Пароль должен содержать не менее ${MIN_PASSWORD_LENGTH} символов`,
        (value) =>
          isEditing || Boolean(value && value.length >= MIN_PASSWORD_LENGTH)
      )
      .ensure(),
  });

export const getEmployeeFormInitialValues = (
  employee: EmployeeDto | null
): EmployeeFormValues => ({
  name: employee?.name ?? "",
  phone: employee?.phone ?? "",
  email: employee?.email ?? "",
  password: "",
});
