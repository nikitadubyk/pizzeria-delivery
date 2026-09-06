export const RESTAURANT_TOKEN_KEY = "restaurantAccessToken";

export const getRestaurantToken = (): string | null =>
  localStorage.getItem(RESTAURANT_TOKEN_KEY);

export const saveRestaurantToken = (token: string): void =>
  localStorage.setItem(RESTAURANT_TOKEN_KEY, token);

export const clearRestaurantToken = (): void =>
  localStorage.removeItem(RESTAURANT_TOKEN_KEY);
