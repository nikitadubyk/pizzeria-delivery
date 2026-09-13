import * as yup from "yup";

import {
  DELIVERY_PRICE_MAX,
  type RestaurantSettingsDto,
  type UpdateRestaurantSettingsRequest,
} from "@/api-contracts";

import type { RestaurantSettingsFormValues } from "./types";

const DELIVERY_PRICE_MAX_RUBLES = DELIVERY_PRICE_MAX / 100;

export const getRestaurantSettingsFormInitialValues = (
  settings?: RestaurantSettingsDto,
): RestaurantSettingsFormValues => ({
  deliveryPrice: (settings?.deliveryPrice ?? 0) / 100,
});

export const getRestaurantSettingsRequest = (
  values: RestaurantSettingsFormValues,
): UpdateRestaurantSettingsRequest => ({
  deliveryPrice: Math.round(Number(values.deliveryPrice) * 100),
});

export const restaurantSettingsFormValidationSchema: yup.ObjectSchema<RestaurantSettingsFormValues> =
  yup.object({
    deliveryPrice: yup
      .number()
      .typeError("Введите цену доставки")
      .min(0, "Цена доставки не должна быть отрицательной")
      .max(
        DELIVERY_PRICE_MAX_RUBLES,
        `Цена доставки не должна превышать ${DELIVERY_PRICE_MAX_RUBLES} ₽`,
      )
      .test(
        "kopecks-precision",
        "Укажите не больше двух знаков после запятой",
        (value) =>
          value === undefined ||
          Math.abs(value * 100 - Math.round(value * 100)) < 1e-8,
      )
      .required("Введите цену доставки"),
  });
