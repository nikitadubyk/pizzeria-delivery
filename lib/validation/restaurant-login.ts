import * as yup from "yup";
import {
  MAX_PASSWORD_LENGTH,
  USER_EMAIL_MAX_LENGTH,
  USER_PHONE_PATTERN,
  type RestaurantLoginInput,
} from "@/api-contracts";

const emailSchema = yup.string().email();

export const restaurantLoginSchema: yup.ObjectSchema<RestaurantLoginInput> =
  yup.object({
    login: yup
      .string()
      .trim()
      .max(USER_EMAIL_MAX_LENGTH)
      .required("Введите email или телефон")
      .test("login-format", "Введите корректный email или телефон", value =>
        !value || emailSchema.isValidSync(value) || USER_PHONE_PATTERN.test(value),
      ),
    password: yup
      .string()
      .max(MAX_PASSWORD_LENGTH)
      .required("Введите пароль"),
  });
