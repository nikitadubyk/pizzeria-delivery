export const DELIVERY_PRICE_MAX = 2_147_483_647;

export type RestaurantSettingsDto = {
  deliveryPrice: number;
};

export type UpdateRestaurantSettingsRequest = {
  deliveryPrice: number;
};
