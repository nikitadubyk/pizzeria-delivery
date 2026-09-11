"use client";

import { useRestaurantIdentity } from "@/app/(admin)/admin/auth-guard";
import { hasRestaurantPermission, type RestaurantPermission } from "@/lib/auth/restaurant-permissions";

/** UI visibility only. Every API operation must also authorize on the server. */
export function useRestaurantPermission(permission: RestaurantPermission): boolean {
  const user = useRestaurantIdentity();
  return hasRestaurantPermission(user.role, permission);
}
