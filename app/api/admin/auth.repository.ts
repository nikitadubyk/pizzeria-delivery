import { findRestaurantUsersForLogin, getRestaurantDb } from "@/lib/prisma";
import type { RestaurantAuthRepository } from "./auth.types";

export const restaurantAuthRepository: RestaurantAuthRepository = {
  findCandidates: findRestaurantUsersForLogin,
  findUser: (restaurantId, id) =>
    getRestaurantDb(restaurantId).user.findUnique({
      where: { id },
      include: { restaurant: true },
    }),
};
