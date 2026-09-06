import type { RestaurantLoginInput } from "@/api-contracts";

export { restaurantLoginSchema as restaurantLoginValidationSchema } from "@/lib/validation/restaurant-login";

export const restaurantLoginInitialValues: RestaurantLoginInput = {
  login: "",
  password: "",
};
