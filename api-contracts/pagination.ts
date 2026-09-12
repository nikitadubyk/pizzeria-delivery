export type PaginationQuery = {
  page?: number;
  limit?: number;
};

export const LIST_SEARCH_MAX_LENGTH = 120;

export type SearchPaginationQuery = PaginationQuery & {
  search?: string;
};

export type ResolvedSearchPaginationQuery = Required<PaginationQuery> &
  Pick<SearchPaginationQuery, "search">;

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PaginatedResponse<T> = {
  items: T[];
  pagination: PaginationMeta;
};
