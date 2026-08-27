"use client";

import { Table as MantineTable, type TableProps } from "@mantine/core";
import { cn } from "@/lib/class-names";
import type { CSSProperties, Key, ReactNode } from "react";

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
  className?: string;
  /** Override the responsive view, useful for embedded layouts and visual tests. */
  displayMode?: TableDisplayMode;
  emptyState?: ReactNode;
  /** Minimum table width before horizontal scrolling is enabled. */
  minWidth?: CSSProperties["minWidth"];
  /** Maximum table height before vertical scrolling is enabled. */
  maxHeight?: CSSProperties["maxHeight"];
  /** Keeps the table heading visible while its rows are scrolled. */
  stickyHeader?: boolean;
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
  maxHeight = 560,
  minWidth = 720,
  rows,
  stickyHeader = true,
  tableProps,
}: AppTableProps<T>) {
  return (
    <div className={cn("w-full min-w-0 max-w-full overflow-hidden", className)}>
      <div
        className={cn(
          "w-full min-w-0 max-w-full overflow-hidden rounded-lg border border-border bg-background",
          displayMode === "responsive" && "hidden md:block",
          displayMode === "table" && "block",
          displayMode === "cards" && "hidden",
        )}
      >
        <MantineTable.ScrollContainer
          className="w-full min-w-0 max-w-full"
          maxHeight={maxHeight}
          minWidth={minWidth}
          scrollAreaProps={{
            scrollbarSize: 10,
            scrollbars: "xy",
            type: "auto",
          }}
          type="scrollarea"
        >
          <MantineTable
            aria-label={ariaLabel}
            highlightOnHover
            horizontalSpacing="lg"
            stickyHeader={stickyHeader}
            verticalSpacing="md"
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
                  <MantineTable.Tr key={getRowKey(row, rowIndex)}>
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
          "gap-3",
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
                className="grid min-w-0 gap-4 rounded-lg border border-border bg-background p-4 shadow-sm"
                key={getRowKey(row, rowIndex)}
                role="listitem"
              >
                {primaryColumns.length > 0 ? (
                  <header className="grid gap-1 border-b border-border pb-3 text-lg font-extrabold leading-snug text-text">
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

                <dl className="m-0 grid grid-cols-2 gap-x-4 gap-y-3">
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
    </div>
  );
}
