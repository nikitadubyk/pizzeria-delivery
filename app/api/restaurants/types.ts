import type {
  CreateRestaurantRequest,
  ResolvedSearchPaginationQuery,
  UpdateRestaurantRequest,
} from "@/api-contracts";
import type { Restaurant } from "@/app/generated/prisma/client";

export type RestaurantPage = {
  items: Restaurant[];
  total: number;
};

export type RestaurantDeletion = {
  restaurant: Restaurant;
  productImageKeys: string[];
};

export interface RestaurantRepository {
  findPage(
    superAdminId: string,
    pagination: ResolvedSearchPaginationQuery,
  ): Promise<RestaurantPage>;
  findById(
    superAdminId: string,
    restaurantId: string,
  ): Promise<Restaurant | null>;
  create(
    superAdminId: string,
    data: CreateRestaurantRequest,
  ): Promise<Restaurant>;
  update(
    superAdminId: string,
    restaurantId: string,
    data: UpdateRestaurantRequest,
  ): Promise<Restaurant>;
  delete(
    superAdminId: string,
    restaurantId: string,
  ): Promise<RestaurantDeletion>;
}
