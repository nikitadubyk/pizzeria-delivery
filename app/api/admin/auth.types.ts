import type { Restaurant, User } from "@/app/generated/prisma/client";

export type RestaurantAuthUser = User & { restaurant: Restaurant | null };

export type AccessibleRestaurantUser = RestaurantAuthUser & {
  restaurantId: string;
  restaurant: Restaurant;
  role: "OWNER" | "EMPLOYEE";
};

export interface RestaurantAuthRepository {
  findCandidates(login: string): Promise<RestaurantAuthUser[]>;
  findUser(restaurantId: string, userId: string): Promise<RestaurantAuthUser | null>;
}
