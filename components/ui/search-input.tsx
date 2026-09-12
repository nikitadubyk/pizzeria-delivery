"use client";

import { IconSearch, IconX } from "@tabler/icons-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, type KeyboardEvent } from "react";

import { cn, interactiveMotionTransitionClassName } from "@/lib/class-names";
import { LIST_SEARCH_MAX_LENGTH } from "@/api-contracts";

import { Input, type AppInputProps } from "./input";
import {
  createSearchUrl,
  normalizeSearchQuery,
  SEARCH_QUERY_PARAM,
} from "./search-input.helpers";

const DEFAULT_DEBOUNCE_MS = 350;

export type SearchInputProps = Omit<
  AppInputProps,
  "defaultValue" | "leftSection" | "onChange" | "rightSection" | "value"
> & {
  debounceMs?: number;
};

export function SearchInput({
  "aria-label": ariaLabel = "Поиск",
  debounceMs = DEFAULT_DEBOUNCE_MS,
  className,
  onKeyDown,
  maxLength = LIST_SEARCH_MAX_LENGTH,
  placeholder = "Поиск...",
  ...props
}: SearchInputProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const serializedSearchParams = searchParams.toString();
  const search = normalizeSearchQuery(searchParams.get(SEARCH_QUERY_PARAM));
  const [draft, setDraft] = useState(() => ({
    observedSearch: search,
    value: search,
  }));
  const value = draft.observedSearch === search ? draft.value : search;

  const updateUrl = useCallback(
    (nextValue: string) => {
      window.history.replaceState(
        null,
        "",
        createSearchUrl(pathname, serializedSearchParams, nextValue),
      );
    },
    [pathname, serializedSearchParams],
  );

  useEffect(() => {
    const normalizedValue = normalizeSearchQuery(value);

    if (normalizedValue === search) return;

    const timeoutId = window.setTimeout(() => {
      updateUrl(normalizedValue);
    }, debounceMs);

    return () => window.clearTimeout(timeoutId);
  }, [debounceMs, search, updateUrl, value]);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);

    if (event.defaultPrevented || event.key !== "Enter") return;

    updateUrl(value);
  };

  if (draft.observedSearch !== search) {
    setDraft({ observedSearch: search, value: search });
  }

  return (
    <div
      className={cn(
        "flex w-full min-w-0 items-center gap-sm sm:min-w-80",
        className,
      )}
    >
      <Input
        aria-label={ariaLabel}
        className="min-w-0 flex-1"
        leftSection={<IconSearch aria-hidden="true" size={18} />}
        maxLength={maxLength}
        onChange={(event) =>
          setDraft({ observedSearch: search, value: event.currentTarget.value })
        }
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        value={value}
        {...props}
      />
      {value ? (
        <button
          aria-label="Очистить поиск"
          className={`grid size-11 shrink-0 cursor-pointer place-items-center rounded-xl border border-border bg-background text-muted hover:border-primary-hover hover:bg-primary-soft hover:text-primary-active focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-active active:scale-95 ${interactiveMotionTransitionClassName}`}
          onClick={() => {
            setDraft({ observedSearch: search, value: "" });
            updateUrl("");
          }}
          type="button"
        >
          <IconX aria-hidden="true" size={18} />
        </button>
      ) : null}
    </div>
  );
}
