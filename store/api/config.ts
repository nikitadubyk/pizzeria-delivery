export enum URL {
  RESTAURANT_CATEGORIES = "/admin/categories",
  RESTAURANT_CATEGORY_OPTIONS = "/admin/categories/options",
  RESTAURANT_PRODUCTS = "/admin/products",
  RESTAURANT_SETTINGS = "/admin/settings",
  RESTAURANT_UPLOADS = "/admin/uploads",
  RESTAURANT_LOGIN = "/admin/login",
  RESTAURANT_ME = "/admin/me",
  SUPER_ADMIN_LOGIN = "/super-admin/login",
  SUPER_ADMIN_ME = "/super-admin/me",
  SUPER_ADMIN_REFRESH = "/super-admin/refresh",
  SUPER_ADMIN_RESTAURANTS = "/super-admin/restaurants",
  SUPER_ADMIN_USERS = "/super-admin/users",
}

export const API_ROUTES = {
  restaurantCategory: (categoryId: string) =>
    `${URL.RESTAURANT_CATEGORIES}/${categoryId}`,
  restaurantProduct: (productId: string) =>
    `${URL.RESTAURANT_PRODUCTS}/${productId}`,
  restaurantProductImage: (productId: string) =>
    `${URL.RESTAURANT_PRODUCTS}/${productId}/image`,
  superAdminRestaurant: (restaurantId: string) =>
    `${URL.SUPER_ADMIN_RESTAURANTS}/${restaurantId}`,
  superAdminUser: (userId: string) => `${URL.SUPER_ADMIN_USERS}/${userId}`,
} as const;

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";
