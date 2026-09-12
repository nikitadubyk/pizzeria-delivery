import type {
  CreateProductRequest,
  ProductListQuery,
  ResolvedSearchPaginationQuery,
  UpdateProductRequest,
} from "@/api-contracts";
import type { Category, Product } from "@/app/generated/prisma/client";

export type ProductWithCategory = Product & {
  category: Pick<Category, "id" | "name">;
};

export type ProductPage = {
  items: ProductWithCategory[];
  total: number;
};

export type ProductUpdateData = UpdateProductRequest & {
  imageUrl?: string | null;
  imageKey?: string | null;
};

export type ResolvedProductListQuery = ResolvedSearchPaginationQuery &
  Pick<ProductListQuery, "categoryId" | "isPublished">;

export interface ProductRepository {
  findPage(
    restaurantId: string,
    query: ResolvedProductListQuery,
  ): Promise<ProductPage>;
  findById(
    restaurantId: string,
    productId: string,
  ): Promise<ProductWithCategory | null>;
  categoryExists(restaurantId: string, categoryId: string): Promise<boolean>;
  create(
    restaurantId: string,
    data: CreateProductRequest,
  ): Promise<ProductWithCategory>;
  update(
    restaurantId: string,
    productId: string,
    data: ProductUpdateData,
  ): Promise<ProductWithCategory>;
  delete(restaurantId: string, productId: string): Promise<ProductWithCategory>;
}

export type StoredProductImage = {
  key: string;
  url: string;
};

export interface ProductImageStorage {
  delete(key: string): Promise<void>;
  deleteMany(keys: readonly string[]): Promise<void>;
}
