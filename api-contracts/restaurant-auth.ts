import type { RestaurantUserRole } from "./super-admin";

export type RestaurantLoginInput = {
  login: string;
  password: string;
};

export type RestaurantLoginResponse = {
  accessToken: string;
};

export type RestaurantIdentity = {
  id: string;
  name: string | null;
  role: RestaurantUserRole;
  restaurant: { id: string; name: string };
};
