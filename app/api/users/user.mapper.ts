import type { SuperAdminUserDto } from "@/api-contracts";
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
