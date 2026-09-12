import {
  LIST_SEARCH_MAX_LENGTH,
  type PaginationMeta,
} from "@/api-contracts";
import * as yup from "yup";

export const createSearchPaginationSchema = ({
  defaultLimit,
  maxLimit,
}: {
  defaultLimit: number;
  maxLimit: number;
}) =>
  yup.object({
    page: yup
      .number()
      .integer("Номер страницы должен быть целым числом")
      .min(1, "Номер страницы должен быть не меньше 1")
      .default(1),
    limit: yup
      .number()
      .integer("Размер страницы должен быть целым числом")
      .min(1, "Размер страницы должен быть не меньше 1")
      .max(
        maxLimit,
        `Размер страницы не должен превышать ${maxLimit}`,
      )
      .default(defaultLimit),
    search: yup
      .string()
      .trim()
      .max(
        LIST_SEARCH_MAX_LENGTH,
        `Поисковый запрос не должен превышать ${LIST_SEARCH_MAX_LENGTH} символов`,
      )
      .transform((value) => (value === "" ? undefined : value))
      .optional(),
  });

export const createPaginationMeta = ({
  page,
  limit,
  total,
}: {
  page: number;
  limit: number;
  total: number;
}): PaginationMeta => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit),
});
