import type {
  CategoryListQuery,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "@/api-contracts";
import type { Category } from "@/app/generated/prisma/client";

export type CategoryPage = {
  items: Category[];
  total: number;
};

export interface CategoryRepository {
  findPage(
    restaurantId: string,
    pagination: Required<CategoryListQuery>,
  ): Promise<CategoryPage>;
  findById(restaurantId: string, categoryId: string): Promise<Category | null>;
  create(restaurantId: string, data: CreateCategoryRequest): Promise<Category>;
  update(
    restaurantId: string,
    categoryId: string,
    data: UpdateCategoryRequest,
  ): Promise<Category>;
  delete(restaurantId: string, categoryId: string): Promise<Category>;
}
