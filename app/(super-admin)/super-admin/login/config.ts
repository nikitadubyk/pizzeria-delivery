import type { SuperAdminLoginRequest } from "@/api-contracts";
import * as yup from "yup";

export const superAdminLoginInitialValues = {
  email: "",
  password: "",
};

export const superAdminLoginValidationSchema: yup.ObjectSchema<SuperAdminLoginRequest> =
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

export type SuperAdminLoginFormValues = SuperAdminLoginRequest;
