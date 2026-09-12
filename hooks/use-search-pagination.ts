import {
  useCallback,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

type SearchPaginationState = {
  page: number;
  search: string;
};

export function useSearchPagination(
  search: string,
): readonly [number, Dispatch<SetStateAction<number>>] {
  const [pagination, setPagination] = useState<SearchPaginationState>({
    page: 1,
    search,
  });

  if (pagination.search !== search) {
    setPagination({ page: 1, search });
  }

  const page = pagination.search === search ? pagination.page : 1;
  const setPage = useCallback<Dispatch<SetStateAction<number>>>(
    (nextPage) => {
      setPagination((current) => {
        const currentPage = current.search === search ? current.page : 1;

        return {
          page:
            typeof nextPage === "function"
              ? nextPage(currentPage)
              : nextPage,
          search,
        };
      });
    },
    [search],
  );

  return [page, setPage] as const;
}
