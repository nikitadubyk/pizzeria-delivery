import type { RestaurantDto } from "@/api-contracts";
import type { Restaurant } from "@/app/generated/prisma/client";

export const toRestaurantDto = (restaurant: Restaurant): RestaurantDto => ({
  id: restaurant.id,
  name: restaurant.name,
  slug: restaurant.slug,
  status: restaurant.status,
  createdAt: restaurant.createdAt.toISOString(),
  updatedAt: restaurant.updatedAt.toISOString(),
});
