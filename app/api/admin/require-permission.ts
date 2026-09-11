import type { RestaurantIdentity } from "@/api-contracts";
import type { RestaurantPermission } from "@/lib/auth/restaurant-permissions";
import { getBearerToken } from "@/lib/auth/bearer-token";
import { restaurantAuth } from "./auth.service";

/** Call before reading business data or performing a mutation in restaurant APIs. */
export async function requireRestaurantPermission(
  request: Request,
  permission: RestaurantPermission,
): Promise<RestaurantIdentity> {
  return restaurantAuth.authorize(await getBearerToken(request), permission);
}
