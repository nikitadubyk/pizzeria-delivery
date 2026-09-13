import * as yup from "yup";

import { DELIVERY_PRICE_MAX } from "@/api-contracts";

export const updateRestaurantSettingsRequestSchema = yup.object({
  deliveryPrice: yup
    .number()
    .typeError("Введите цену доставки")
    .integer("Цена доставки должна быть указана в целых копейках")
    .min(0, "Цена доставки не должна быть отрицательной")
    .max(
      DELIVERY_PRICE_MAX,
      `Цена доставки не должна превышать ${DELIVERY_PRICE_MAX} копеек`,
    )
    .required("Введите цену доставки"),
});
