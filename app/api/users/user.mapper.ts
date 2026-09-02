import type { RestaurantUserDto, SuperAdminUserDto } from "@/api-contracts";
import type { RestaurantUser } from "@/app/api/users/types";
import type { User } from "@/app/generated/prisma/client";

export const toSuperAdminUserDto = (user: User): SuperAdminUserDto => ({
  id: user.id,
  restaurantId: null,
  phone: user.phone,
  email: user.email,
  name: user.name,
  role: "SUPER_ADMIN",
  isActive: user.isActive,
  createdAt: user.createdAt.toISOString(),
  updatedAt: user.updatedAt.toISOString(),
});

export const toRestaurantUserDto = (
  user: RestaurantUser,
): RestaurantUserDto => ({
  id: user.id,
  restaurantId: user.restaurantId!,
  restaurant: user.restaurant!,
  phone: user.phone!,
  email: user.email,
  name: user.name,
  role: user.role as RestaurantUserDto["role"],
  isActive: user.isActive,
  createdAt: user.createdAt.toISOString(),
  updatedAt: user.updatedAt.toISOString(),
});
