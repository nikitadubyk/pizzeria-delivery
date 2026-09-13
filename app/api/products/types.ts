import type {
  CreateProductRequest,
  ProductListQuery,
  ProductVariantRequest,
  ResolvedSearchPaginationQuery,
  UpdateProductRequest,
} from "@/api-contracts";
import type {
  Category,
  Product,
  ProductVariant,
} from "@/app/generated/prisma/client";

export type ProductWithCategory = Product & {
  category: Pick<Category, "id" | "name">;
  variants: ProductVariant[];
};

export type ProductPage = {
  items: ProductWithCategory[];
  total: number;
};

export type ProductUpdateData = UpdateProductRequest & {
  imageUrl?: string | null;
  imageKey?: string | null;
};

export type ProductData = Omit<CreateProductRequest, "variants">;
export type ProductVariantWrite = Omit<ProductVariantRequest, "id"> & {
  id?: string;
  sortOrder: number;
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
    data: ProductData,
    variants: readonly ProductVariantWrite[],
  ): Promise<ProductWithCategory>;
  update(
    restaurantId: string,
    productId: string,
    data: Omit<ProductUpdateData, "variants">,
    variants?: readonly ProductVariantWrite[],
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
