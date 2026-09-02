"use client";

import { Table as MantineTable, type TableProps } from "@mantine/core";
import { cn } from "@/lib/class-names";
import type {
  CSSProperties,
  KeyboardEvent,
  Key,
  MouseEvent,
  ReactNode,
} from "react";
import { Pagination, type AppPaginationProps } from "../pagination";

export type TableColumnAlign = "left" | "center" | "right";
export type TableMobileLayout = "field" | "primary" | "full" | "hidden";
export type TableDisplayMode = "cards" | "responsive" | "table";

export type TableColumn<T> = {
  /** Stable identifier used as the React key for this column. */
  key: string;
  /** Column heading in the desktop and tablet table. */
  header: ReactNode;
  /** Renders the value for both the table cell and mobile card. */
  render: (row: T, rowIndex: number) => ReactNode;
  align?: TableColumnAlign;
  /** Label shown in a mobile card. Defaults to `header`. */
  mobileLabel?: ReactNode;
  /** Controls how this column is presented in a mobile card. */
  mobileLayout?: TableMobileLayout;
  /** Makes a regular mobile field span both card columns. */
  mobileFullWidth?: boolean;
  width?: CSSProperties["width"];
};

export type AppTableProps<T> = {
  /** Accessible name shared by the table and mobile list. */
  ariaLabel: string;
  columns: readonly TableColumn<T>[];
  rows: readonly T[];
  getRowKey: (row: T, rowIndex: number) => Key;
  /** Accessible label for an interactive row. */
  getRowAriaLabel?: (row: T, rowIndex: number) => string;
  /** Makes both the desktop row and mobile card keyboard-accessible. */
  onRowClick?: (row: T, rowIndex: number) => void;
  className?: string;
  /** Override the responsive view, useful for embedded layouts and visual tests. */
  displayMode?: TableDisplayMode;
  emptyState?: ReactNode;
  /** Minimum table width before horizontal scrolling is enabled. */
  minWidth?: CSSProperties["minWidth"];
  /** Minimum component height before the table is allowed to scroll internally. */
  minHeight?: CSSProperties["minHeight"];
  /** Maximum table height before vertical scrolling is enabled. */
  maxHeight?: CSSProperties["maxHeight"];
  /** Keeps the table heading visible while its rows are scrolled. */
  stickyHeader?: boolean;
  /** Optional pagination displayed below the table or mobile cards. */
  pagination?: AppPaginationProps;
  tableProps?: Omit<TableProps, "aria-label" | "children">;
};

const alignClassNames: Record<TableColumnAlign, string> = {
  center: "text-center",
  left: "text-left",
  right: "text-right",
};

export function Table<T>({
  ariaLabel,
  className,
  columns,
  displayMode = "responsive",
  emptyState = "Нет данных",
  getRowKey,
  getRowAriaLabel,
  maxHeight,
  minHeight = 320,
  minWidth = 720,
  onRowClick,
  pagination,
  rows,
  stickyHeader = true,
  tableProps,
}: AppTableProps<T>) {
  const isInteractiveTarget = (target: EventTarget | null) =>
    target instanceof Element &&
    Boolean(
      target.closest("button, a, input, select, textarea, [role='button']"),
    );

  const getInteractiveRowProps = (row: T, rowIndex: number) => {
    if (!onRowClick) return {};

    return {
      "aria-label": getRowAriaLabel?.(row, rowIndex),
      onClick: (event: MouseEvent<HTMLElement>) => {
        if (!isInteractiveTarget(event.target)) onRowClick(row, rowIndex);
      },
      onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
        if (
          event.target !== event.currentTarget ||
          (event.key !== "Enter" && event.key !== " ")
        ) {
          return;
        }

        event.preventDefault();
        onRowClick(row, rowIndex);
      },
      tabIndex: 0,
    };
  };

  return (
    <div
      className={cn(
        "flex min-h-0 w-full min-w-0 max-w-full flex-1 flex-col overflow-hidden rounded-lg border border-border bg-background",
        className,
      )}
      style={{ minHeight }}
    >
      <div
        className={cn(
          "min-h-0 w-full min-w-0 max-w-full flex-1 flex-col overflow-hidden",
          displayMode === "responsive" && "hidden md:flex",
          displayMode === "table" && "flex",
          displayMode === "cards" && "hidden",
        )}
      >
        <MantineTable.ScrollContainer
          className="h-full min-h-0 w-full min-w-0 max-w-full flex-1"
          maxHeight={maxHeight}
          minWidth={minWidth}
          scrollAreaProps={{
            styles: {
              viewport: {
                inset: 0,
                position: "absolute",
              },
            },
            scrollbarSize: 10,
            scrollbars: "xy",
            type: "auto",
          }}
          type="scrollarea"
        >
          <MantineTable
            aria-label={ariaLabel}
            highlightOnHover
            horizontalSpacing="md"
            stickyHeader={stickyHeader}
            verticalSpacing="sm"
            withRowBorders
            {...tableProps}
          >
            <MantineTable.Thead className="bg-surface">
              <MantineTable.Tr>
                {columns.map((column) => (
                  <MantineTable.Th
                    className={cn(
                      "whitespace-nowrap !bg-surface text-sm font-extrabold text-text",
                      alignClassNames[column.align ?? "left"],
                    )}
                    key={column.key}
                    scope="col"
                    style={{ width: column.width }}
                  >
                    {column.header}
                  </MantineTable.Th>
                ))}
              </MantineTable.Tr>
            </MantineTable.Thead>

            <MantineTable.Tbody>
              {rows.length > 0 ? (
                rows.map((row, rowIndex) => (
                  <MantineTable.Tr
                    className={cn(
                      onRowClick &&
                        "cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary-active",
                    )}
                    key={getRowKey(row, rowIndex)}
                    {...getInteractiveRowProps(row, rowIndex)}
                  >
                    {columns.map((column) => (
                      <MantineTable.Td
                        className={cn(
                          "text-sm text-text",
                          alignClassNames[column.align ?? "left"],
                        )}
                        key={column.key}
                      >
                        {column.render(row, rowIndex)}
                      </MantineTable.Td>
                    ))}
                  </MantineTable.Tr>
                ))
              ) : (
                <MantineTable.Tr>
                  <MantineTable.Td
                    className="py-10 text-center text-sm text-muted"
                    colSpan={Math.max(columns.length, 1)}
                  >
                    {emptyState}
                  </MantineTable.Td>
                </MantineTable.Tr>
              )}
            </MantineTable.Tbody>
          </MantineTable>
        </MantineTable.ScrollContainer>
      </div>

      <div
        aria-label={ariaLabel}
        className={cn(
          "min-h-0 flex-1 content-start auto-rows-max gap-2 overflow-y-auto overscroll-contain p-2 md:gap-3 md:p-3",
          displayMode === "responsive" && "grid md:hidden",
          displayMode === "cards" && "grid",
          displayMode === "table" && "hidden",
        )}
        role="list"
      >
        {rows.length > 0 ? (
          rows.map((row, rowIndex) => {
            const visibleColumns = columns.filter(
              (column) => column.mobileLayout !== "hidden",
            );
            const primaryColumns = visibleColumns.filter(
              (column) => column.mobileLayout === "primary",
            );
            const detailColumns = visibleColumns.filter(
              (column) =>
                column.mobileLayout !== "primary" &&
                column.mobileLayout !== "full",
            );
            const fullWidthColumns = visibleColumns.filter(
              (column) => column.mobileLayout === "full",
            );

            return (
              <article
                className={cn(
                  "relative grid min-w-0 gap-3 rounded-lg border border-border bg-background p-3 shadow-sm md:gap-4 md:p-4",
                  onRowClick &&
                    "cursor-pointer transition-colors hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary-active",
                )}
                key={getRowKey(row, rowIndex)}
                role="listitem"
                {...getInteractiveRowProps(row, rowIndex)}
              >
                {primaryColumns.length > 0 ? (
                  <header className="grid gap-1 border-b border-border pb-2 text-lg font-extrabold leading-snug text-text md:pb-3">
                    {primaryColumns.map((column) => (
                      <div key={column.key}>
                        <span className="sr-only">
                          {column.mobileLabel ?? column.header}:{" "}
                        </span>
                        {column.render(row, rowIndex)}
                      </div>
                    ))}
                  </header>
                ) : null}

                <dl className="m-0 grid grid-cols-2 gap-x-3 gap-y-2 md:gap-x-4 md:gap-y-3">
                  {detailColumns.map((column) => (
                    <div
                      className={cn(
                        "grid min-w-0 gap-1",
                        column.mobileFullWidth && "col-span-2",
                      )}
                      key={column.key}
                    >
                      <dt className="text-sm leading-snug text-muted">
                        {column.mobileLabel ?? column.header}
                      </dt>
                      <dd className="m-0 min-w-0 text-left text-sm font-semibold leading-snug text-text">
                        {column.render(row, rowIndex)}
                      </dd>
                    </div>
                  ))}
                </dl>

                {fullWidthColumns.map((column) => (
                  <div className="min-w-0" key={column.key}>
                    {column.render(row, rowIndex)}
                  </div>
                ))}
              </article>
            );
          })
        ) : (
          <div className="rounded-lg border border-dashed border-border bg-surface px-4 py-8 text-center text-sm text-muted">
            {emptyState}
          </div>
        )}
      </div>

      {pagination ? (
        <div className="relative z-10 flex shrink-0 justify-center border-t border-border bg-background px-2 py-1.5 md:justify-end">
          <Pagination {...pagination} />
        </div>
      ) : null}
    </div>
  );
}
