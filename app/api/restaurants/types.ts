import type {
  CreateRestaurantRequest,
  UpdateRestaurantRequest,
} from "@/api-contracts";
import type { Restaurant } from "@/app/generated/prisma/client";

export interface RestaurantRepository {
  findMany(superAdminId: string): Promise<Restaurant[]>;
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
  delete(superAdminId: string, restaurantId: string): Promise<Restaurant>;
}
