"use client";

import type { ReactNode } from "react";
import { IconRefresh } from "@tabler/icons-react";
import { cn } from "@/lib/class-names";
import { Loader } from "./loader";
import { Button, EmptyState } from "./ui";

export type DetailsProps = {
  children?: ReactNode;
  className?: string;
  query?: {
    isLoading?: boolean;
    isFetching?: boolean;
    isError?: boolean;
    refetch?: () => unknown;
  };
  errorMessage?: string;
  onRetry?: () => unknown;
  loadingLabel?: string;
};

export function Details({
  children,
  className,
  query,
  errorMessage = "Не удалось загрузить данные",
  onRetry,
  loadingLabel = "Загрузка…",
}: DetailsProps) {
  const {
    isLoading = false,
    isFetching = false,
    isError = false,
    refetch,
  } = query ?? {};
  const retry = onRetry ?? refetch;
  const pending = isLoading || (isError && isFetching);

  return (
    <div
      className={cn("relative min-h-40 min-w-0", className)}
      aria-busy={isLoading || isFetching}
    >
      {pending ? (
        <Loader className="absolute inset-0 min-h-0" label={loadingLabel} />
      ) : isError ? (
        <div
          className="grid h-full flex-1 place-items-center overflow-auto"
          role="alert"
        >
          <EmptyState
            title={errorMessage}
            description="Проверьте соединение и попробуйте ещё раз."
            action={
              retry && (
                <Button
                  type="button"
                  leftSection={<IconRefresh aria-hidden="true" size={18} />}
                  onClick={() => {
                    retry();
                  }}
                >
                  Повторить
                </Button>
              )
            }
          />
        </div>
      ) : (
        <>
          <div className="contents" inert={isFetching}>
            {children}
          </div>
          {isFetching && (
            <Loader
              className="bg-background/80 absolute inset-0 z-10 min-h-0"
              label="Обновление данных…"
            />
          )}
        </>
      )}
    </div>
  );
}
