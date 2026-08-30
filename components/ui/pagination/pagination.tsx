"use client";

import {
  Pagination as MantinePagination,
  type PaginationProps as MantinePaginationProps,
} from "@mantine/core";
import { cn } from "@/lib/class-names";

export type AppPaginationProps = Omit<
  MantinePaginationProps,
  "color" | "layout"
> & {
  ariaLabel?: string;
};

const controlLabels = {
  first: "Перейти на первую страницу",
  last: "Перейти на последнюю страницу",
  next: "Перейти на следующую страницу",
  previous: "Перейти на предыдущую страницу",
} as const;

export function Pagination({
  ariaLabel = "Навигация по страницам",
  className,
  formatLabel = ({ page, totalPages }) => `Страница ${page} из ${totalPages}`,
  getControlProps,
  radius = "xl",
  size = "md",
  ...props
}: AppPaginationProps) {
  return (
    <nav
      aria-label={ariaLabel}
      className={cn(
        "w-full min-w-0 max-w-full [&_.mantine-Group-root]:justify-center md:[&_.mantine-Group-root]:justify-end",
        className,
      )}
    >
      <MantinePagination
        classNames={{
          root: "w-full",
          control:
            "border-border bg-background font-bold text-text shadow-sm hover:border-primary-hover hover:bg-primary-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-active data-[active]:border-primary data-[active]:bg-primary data-[active]:text-primary-contrast",
          label: "font-bold text-text",
        }}
        color="brand"
        formatLabel={formatLabel}
        getControlProps={(control) => ({
          "aria-label": controlLabels[control],
          ...getControlProps?.(control),
        })}
        layout="responsive"
        radius={radius}
        size={size}
        {...props}
      />
    </nav>
  );
}
