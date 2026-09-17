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
      .required("Введите цену доставки"),
  });
