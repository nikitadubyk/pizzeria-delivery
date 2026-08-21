export type RestaurantStatus = "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export type RestaurantDto = {
  id: string;
  name: string;
  slug: string;
  status: RestaurantStatus;
  createdAt: string;
  updatedAt: string;
};

export type RestaurantPathParams = {
  restaurantId: string;
};

export type CreateRestaurantRequest = {
  name: string;
  slug: string;
  status?: RestaurantStatus;
};

export type UpdateRestaurantRequest = {
  name?: string;
  slug?: string;
  status?: RestaurantStatus;
};

export type UpdateRestaurantApiRequest = RestaurantPathParams & {
  data: UpdateRestaurantRequest;
};
