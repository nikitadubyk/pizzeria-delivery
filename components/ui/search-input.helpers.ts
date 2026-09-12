export const SEARCH_QUERY_PARAM = "search";
export const PAGE_QUERY_PARAM = "page";

export const normalizeSearchQuery = (value: string | null | undefined) =>
  value?.trim() ?? "";

export function createSearchUrl(
  pathname: string,
  serializedSearchParams: string,
  value: string,
) {
  const search = normalizeSearchQuery(value);
  const searchParams = new URLSearchParams(serializedSearchParams);

  if (search) {
    searchParams.set(SEARCH_QUERY_PARAM, search);
  } else {
    searchParams.delete(SEARCH_QUERY_PARAM);
  }

  searchParams.delete(PAGE_QUERY_PARAM);

  const query = searchParams.toString();
  return query ? `${pathname}?${query}` : pathname;
}
