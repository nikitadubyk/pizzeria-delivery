import type {
  CreateProductRequest,
  ProductListQuery,
  ProductVariantRequest,
  ResolvedSearchPaginationQuery,
  UpdateProductRequest,
} from "@/api-contracts";
import type {
  Category,
  Addon,
  Ingredient,
  Product,
  ProductAddon,
  ProductRemovableIngredient,
  ProductVariant,
} from "@/app/generated/prisma/client";

export type ProductWithCategory = Product & {
  category: Pick<Category, "id" | "name">;
  variants: ProductVariant[];
  removableIngredients: (ProductRemovableIngredient & {
    ingredient: Pick<Ingredient, "id" | "name">;
  })[];
  addons: (ProductAddon & {
    addon: Pick<Addon, "id" | "name" | "price" | "isAvailable">;
  })[];
};

export type ProductPage = {
  items: ProductWithCategory[];
  total: number;
};

export type ProductUpdateData = UpdateProductRequest & {
  imageUrl?: string | null;
  imageKey?: string | null;
};

export type ProductRemovableIngredientWrite = {
  ingredientId: string;
};

export type ProductAddonWrite = { addonId: string };

export type ProductData = Omit<
  CreateProductRequest,
  "variants" | "removableIngredientIds" | "addonIds"
>;
export type ProductVariantWrite = Omit<ProductVariantRequest, "id"> & {
  id?: string;
  sortOrder: number;
};

export type ResolvedProductListQuery = ResolvedSearchPaginationQuery &
  Pick<ProductListQuery, "categoryId" | "isPublished">;

export interface ProductRepository {
  findPage(
    restaurantId: string,
    query: ResolvedProductListQuery
  ): Promise<ProductPage>;
  findById(
    restaurantId: string,
    productId: string
  ): Promise<ProductWithCategory | null>;
  categoryExists(restaurantId: string, categoryId: string): Promise<boolean>;
  ingredientsCount(
    restaurantId: string,
    ingredientIds: readonly string[]
  ): Promise<number>;
  addonsCount(
    restaurantId: string,
    addonIds: readonly string[]
  ): Promise<number>;
  create(
    restaurantId: string,
    data: ProductData,
    variants: readonly ProductVariantWrite[],
    removableIngredients: readonly ProductRemovableIngredientWrite[],
    addons: readonly ProductAddonWrite[]
  ): Promise<ProductWithCategory>;
  update(
    restaurantId: string,
    productId: string,
    data: Omit<
      ProductUpdateData,
      "variants" | "removableIngredientIds" | "addonIds"
    >,
    variants?: readonly ProductVariantWrite[],
    removableIngredients?: readonly ProductRemovableIngredientWrite[],
    addons?: readonly ProductAddonWrite[]
  ): Promise<ProductWithCategory>;
  updateAvailability(
    restaurantId: string,
    productId: string,
    isAvailable: boolean
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
