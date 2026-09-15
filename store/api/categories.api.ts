import type {
  CategoryDto,
  CategoryListResponse,
  CategoryOptionDto,
  CategoryPathParams,
  CreateCategoryRequest,
  ResolvedSearchPaginationQuery,
  UpdateCategoryApiRequest,
  UpdateCategoryVisibilityApiRequest,
} from "@/api-contracts";

import { API_ROUTES, URL } from "./config";
import { restaurantAuthApi } from "./restaurant-auth.api";

const CATEGORY_TAG = "Category" as const;

export const categoriesApi = restaurantAuthApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<
      CategoryListResponse,
      ResolvedSearchPaginationQuery
    >({
      query: (params) => ({
        url: URL.RESTAURANT_CATEGORIES,
        method: "GET",
        params,
      }),
      providesTags: [CATEGORY_TAG],
    }),
    getCategoryOptions: builder.query<CategoryOptionDto[], void>({
      query: () => ({
        url: URL.RESTAURANT_CATEGORY_OPTIONS,
        method: "GET",
      }),
      providesTags: [CATEGORY_TAG],
    }),
    getCategory: builder.query<CategoryDto, CategoryPathParams>({
      query: ({ categoryId }) => ({
        url: API_ROUTES.restaurantCategory(categoryId),
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
        url: API_ROUTES.restaurantCategory(categoryId),
        method: "PATCH",
        data,
      }),
      invalidatesTags: [CATEGORY_TAG],
    }),
    updateCategoryVisibility: builder.mutation<
      CategoryDto,
      UpdateCategoryVisibilityApiRequest
    >({
      query: ({ categoryId, data }) => ({
        url: API_ROUTES.restaurantCategoryVisibility(categoryId),
        method: "PATCH",
        data,
      }),
      onQueryStarted: async (
        { categoryId, data },
        { dispatch, getState, queryFulfilled },
      ) => {
        const listPatches = categoriesApi.util
          .selectCachedArgsForQuery(getState(), "getCategories")
          .map((query) =>
            dispatch(
              categoriesApi.util.updateQueryData(
                "getCategories",
                query,
                (draft) => {
                  const category = draft.items.find(
                    (item) => item.id === categoryId,
                  );
                  if (category) category.isPublished = data.isPublished;
                },
              ),
            ),
          );
        const categoryPatch = dispatch(
          categoriesApi.util.updateQueryData(
            "getCategory",
            { categoryId },
            (draft) => {
              draft.isPublished = data.isPublished;
            },
          ),
        );

        try {
          await queryFulfilled;
        } catch {
          categoryPatch.undo();
          listPatches.forEach((patch) => patch.undo());
        }
      },
      invalidatesTags: [CATEGORY_TAG],
    }),
    deleteCategory: builder.mutation<CategoryDto, CategoryPathParams>({
      query: ({ categoryId }) => ({
        url: API_ROUTES.restaurantCategory(categoryId),
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
  useGetCategoryOptionsQuery,
  useGetCategoryQuery,
  useUpdateCategoryMutation,
  useUpdateCategoryVisibilityMutation,
} = categoriesApi;
