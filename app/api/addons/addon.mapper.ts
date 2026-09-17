import type { AddonDto } from "@/api-contracts";
import type { Addon } from "@/app/generated/prisma/client";

export const toAddonDto = (addon: Addon): AddonDto => ({
  id: addon.id,
  restaurantId: addon.restaurantId,
  name: addon.name,
  price: addon.price,
  isAvailable: addon.isAvailable,
  createdAt: addon.createdAt.toISOString(),
  updatedAt: addon.updatedAt.toISOString(),
});
