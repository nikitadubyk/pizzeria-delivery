import type {
  CreateProductRequest,
  ProductDto,
  ProductListQuery,
  ProductListResponse,
  ProductPathParams,
  ResolvedSearchPaginationQuery,
  UpdateProductApiRequest,
} from "@/api-contracts";

import { API_ROUTES, URL } from "./config";
import { restaurantAuthApi } from "./restaurant-auth.api";

export const PRODUCT_TAG = "Product" as const;

type ProductListApiQuery = ResolvedSearchPaginationQuery &
  Pick<ProductListQuery, "categoryId" | "isPublished">;

export const productsApi = restaurantAuthApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ProductListResponse, ProductListApiQuery>({
      query: (params) => ({
        url: URL.RESTAURANT_PRODUCTS,
        method: "GET",
        params,
      }),
      providesTags: [PRODUCT_TAG],
    }),
    getProduct: builder.query<ProductDto, ProductPathParams>({
      query: ({ productId }) => ({
        url: API_ROUTES.restaurantProduct(productId),
        method: "GET",
      }),
      providesTags: [PRODUCT_TAG],
    }),
    createProduct: builder.mutation<ProductDto, CreateProductRequest>({
      query: (data) => ({
        url: URL.RESTAURANT_PRODUCTS,
        method: "POST",
        data,
      }),
      invalidatesTags: [PRODUCT_TAG],
    }),
    updateProduct: builder.mutation<ProductDto, UpdateProductApiRequest>({
      query: ({ productId, data }) => ({
        url: API_ROUTES.restaurantProduct(productId),
        method: "PATCH",
        data,
      }),
      invalidatesTags: [PRODUCT_TAG],
    }),
    deleteProduct: builder.mutation<ProductDto, ProductPathParams>({
      query: ({ productId }) => ({
        url: API_ROUTES.restaurantProduct(productId),
        method: "DELETE",
      }),
      invalidatesTags: [PRODUCT_TAG],
    }),
    removeProductImage: builder.mutation<ProductDto, ProductPathParams>({
      query: ({ productId }) => ({
        url: API_ROUTES.restaurantProductImage(productId),
        method: "DELETE",
      }),
      invalidatesTags: [PRODUCT_TAG],
    }),
  }),
});

export const {
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetProductQuery,
  useGetProductsQuery,
  useRemoveProductImageMutation,
  useUpdateProductMutation,
} = productsApi;
