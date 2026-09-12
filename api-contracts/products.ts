import type { PaginatedResponse, SearchPaginationQuery } from "./pagination";

export const PRODUCT_NAME_MAX_LENGTH = 160;
export const PRODUCT_DESCRIPTION_MAX_LENGTH = 5_000;
export const PRODUCT_BASE_COMPOSITION_MAX_LENGTH = 2_000;
export const PRODUCT_LIST_DEFAULT_LIMIT = 20;
export const PRODUCT_LIST_MAX_LIMIT = 100;
export const PRODUCT_SORT_ORDER_MAX = 2_147_483_647;
export const PRODUCT_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export type ProductDto = {
  id: string;
  restaurantId: string;
  categoryId: string;
  category: {
    id: string;
    name: string;
  };
  name: string;
  description: string | null;
  baseComposition: string | null;
  imageUrl: string | null;
  sortOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ProductPathParams = {
  productId: string;
};

export type ProductListQuery = SearchPaginationQuery & {
  categoryId?: string;
  isPublished?: boolean;
};

export type ProductListResponse = PaginatedResponse<ProductDto>;

export type CreateProductRequest = {
  categoryId: string;
  name: string;
  description?: string | null;
  baseComposition?: string | null;
  sortOrder?: number;
  isPublished?: boolean;
};

export type UpdateProductRequest = Partial<CreateProductRequest>;

export type UpdateProductApiRequest = ProductPathParams & {
  data: UpdateProductRequest;
};
