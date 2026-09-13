import * as yup from "yup";

import type { SuperAdminLoginFormValues } from "./types";

export const superAdminLoginInitialValues = {
  email: "",
  password: "",
};

export const superAdminLoginValidationSchema: yup.ObjectSchema<SuperAdminLoginFormValues> =
  yup.object({
    email: yup
      .string()
      .email("Введите корректный email")
      .required("Введите email"),
    password: yup
      .string()
      .min(8, "Пароль должен содержать не менее 8 символов")
      .required("Введите пароль"),
  });
