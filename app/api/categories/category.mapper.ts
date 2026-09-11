import type { CategoryDto } from "@/api-contracts";
import type { Category } from "@/app/generated/prisma/client";

export const toCategoryDto = (category: Category): CategoryDto => ({
  id: category.id,
  restaurantId: category.restaurantId,
  name: category.name,
  sortOrder: category.sortOrder,
  isPublished: category.isPublished,
  createdAt: category.createdAt.toISOString(),
  updatedAt: category.updatedAt.toISOString(),
});
