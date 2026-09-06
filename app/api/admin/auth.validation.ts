import * as yup from "yup";
import { RESTAURANT_SESSION } from "./auth.config";

export { restaurantLoginSchema } from "@/lib/validation/restaurant-login";

export const restaurantSessionSchema = yup
  .object({
    sub: yup.string().trim().required(),
    restaurantId: yup.string().trim().required(),
    type: yup.string().oneOf([RESTAURANT_SESSION.type]).required(),
    version: yup.number().integer().min(0).required(),
  })
  .strict();
