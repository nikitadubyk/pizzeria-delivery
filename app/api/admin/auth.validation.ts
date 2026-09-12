import * as yup from "yup";
import { RESTAURANT_SESSION } from "./auth.config";

export { restaurantLoginSchema } from "@/lib/validation/restaurant-login";

export const restaurantSessionSchema = yup
  .object({
    sub: yup.string().trim().required("Идентификатор пользователя обязателен"),
    restaurantId: yup
      .string()
      .trim()
      .required("Идентификатор ресторана обязателен"),
    type: yup
      .string()
      .oneOf([RESTAURANT_SESSION.type], "Некорректный тип сессии")
      .required("Тип сессии обязателен"),
    version: yup
      .number()
      .typeError("Версия сессии должна быть числом")
      .integer("Версия сессии должна быть целым числом")
      .min(0, "Версия сессии не должна быть отрицательной")
      .required("Версия сессии обязательна"),
  })
  .strict();
