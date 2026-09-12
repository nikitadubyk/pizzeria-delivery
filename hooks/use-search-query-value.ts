"use client";

import { useSearchParams } from "next/navigation";

import {
  normalizeSearchQuery,
  SEARCH_QUERY_PARAM,
} from "@/components/ui/search-input.helpers";

export function useSearchQueryValue() {
  return normalizeSearchQuery(useSearchParams().get(SEARCH_QUERY_PARAM));
}
