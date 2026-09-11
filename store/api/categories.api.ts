import type {
  CategoryDto,
  CategoryListQuery,
  CategoryListResponse,
  CategoryPathParams,
  CreateCategoryRequest,
  UpdateCategoryApiRequest,
} from "@/api-contracts";

import { URL } from "./config";
import { restaurantAuthApi } from "./restaurant-auth.api";

const CATEGORY_TAG = "Category" as const;

export const categoriesApi = restaurantAuthApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<
      CategoryListResponse,
      Required<CategoryListQuery>
    >({
      query: (params) => ({
        url: URL.RESTAURANT_CATEGORIES,
        method: "GET",
        params,
      }),
      providesTags: [CATEGORY_TAG],
    }),
    getCategory: builder.query<CategoryDto, CategoryPathParams>({
      query: ({ categoryId }) => ({
        url: `${URL.RESTAURANT_CATEGORIES}/${categoryId}`,
        method: "GET",
      }),
      providesTags: [CATEGORY_TAG],
    }),
    createCategory: builder.mutation<CategoryDto, CreateCategoryRequest>({
      query: (data) => ({
        url: URL.RESTAURANT_CATEGORIES,
        method: "POST",
        data,
      }),
      invalidatesTags: [CATEGORY_TAG],
    }),
    updateCategory: builder.mutation<CategoryDto, UpdateCategoryApiRequest>({
      query: ({ categoryId, data }) => ({
        url: `${URL.RESTAURANT_CATEGORIES}/${categoryId}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [CATEGORY_TAG],
    }),
    deleteCategory: builder.mutation<CategoryDto, CategoryPathParams>({
      query: ({ categoryId }) => ({
        url: `${URL.RESTAURANT_CATEGORIES}/${categoryId}`,
        method: "DELETE",
      }),
      invalidatesTags: [CATEGORY_TAG],
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useUpdateCategoryMutation,
} = categoriesApi;
