"use client";

import type { ReactNode } from "react";
import { IconRefresh } from "@tabler/icons-react";
import { cn } from "@/lib/class-names";
import { Loader } from "./loader";
import { Button, EmptyState } from "./ui";

export type DetailsProps = {
  children?: ReactNode;
  className?: string;
  isLoading?: boolean;
  isFetching?: boolean;
  isError?: boolean;
  errorMessage?: string;
  onRetry?: () => unknown;
  loadingLabel?: string;
};

export function Details({
  children,
  className,
  isLoading = false,
  isFetching = false,
  isError = false,
  errorMessage = "Не удалось загрузить данные",
  onRetry,
  loadingLabel = "Загрузка…",
}: DetailsProps) {
  const pending = isLoading || (isError && isFetching);

  return (
    <div
      className={cn("relative min-h-40 min-w-0", className)}
      aria-busy={isLoading || isFetching}
    >
      {pending ? (
        <Loader className="absolute inset-0 min-h-0" label={loadingLabel} />
      ) : isError ? (
        <div className="grid h-full flex-1 place-items-center overflow-auto" role="alert">
          <EmptyState
            title={errorMessage}
            description="Проверьте соединение и попробуйте ещё раз."
            action={onRetry && (
              <Button
                type="button"
                leftSection={<IconRefresh aria-hidden="true" size={18} />}
                onClick={() => { onRetry(); }}
              >
                Повторить
              </Button>
            )}
          />
        </div>
      ) : (
        <>
          <div className="contents" inert={isFetching}>
            {children}
          </div>
          {isFetching && (
            <Loader
              className="absolute inset-0 z-10 min-h-0 bg-background/80"
              label="Обновление данных…"
            />
          )}
        </>
      )}
    </div>
  );
}
