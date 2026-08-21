import { MIN_PASSWORD_LENGTH } from "@/app/api/users/config";
import * as yup from "yup";

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
