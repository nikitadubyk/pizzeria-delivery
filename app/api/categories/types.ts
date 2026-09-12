import type {
  CreateCategoryRequest,
  ResolvedSearchPaginationQuery,
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
    pagination: ResolvedSearchPaginationQuery,
  ): Promise<CategoryPage>;
  findOptions(restaurantId: string): Promise<Category[]>;
  findById(restaurantId: string, categoryId: string): Promise<Category | null>;
  create(restaurantId: string, data: CreateCategoryRequest): Promise<Category>;
  update(
    restaurantId: string,
    categoryId: string,
    data: UpdateCategoryRequest,
  ): Promise<Category>;
  delete(restaurantId: string, categoryId: string): Promise<Category>;
}
