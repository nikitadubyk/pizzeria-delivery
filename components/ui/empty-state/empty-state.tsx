"use client";

import { Box } from "@mantine/core";
import { cn } from "@/lib/class-names";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

export type EmptyStateSize = "sm" | "md" | "lg";

export type EmptyStateProps = Omit<
  ComponentPropsWithoutRef<"section">,
  "children" | "title"
> & {
  action?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  imageAlt?: string;
  imageSrc?: string;
  size?: EmptyStateSize;
  title: ReactNode;
};

const rootSizeClassNames: Record<EmptyStateSize, string> = {
  sm: "gap-3 px-4 py-6",
  md: "gap-4 px-6 py-8",
  lg: "gap-5 px-8 py-12",
};

const mediaSizeClassNames: Record<EmptyStateSize, string> = {
  sm: "size-14",
  md: "size-18",
  lg: "size-24",
};

const titleSizeClassNames: Record<EmptyStateSize, string> = {
  sm: "text-md",
  md: "text-lg",
  lg: "text-xl",
};

export function EmptyState({
  action,
  className,
  description,
  icon,
  imageAlt = "",
  imageSrc,
  size = "md",
  title,
  ...props
}: EmptyStateProps) {
  const media = imageSrc ? (
    <Box
      alt={imageAlt}
      className={cn(
        "border-border bg-surface block rounded-full border object-cover",
        mediaSizeClassNames[size]
      )}
      component="img"
      src={imageSrc}
    />
  ) : icon ? (
    <div
      aria-hidden="true"
      className={cn(
        "border-border bg-primary-soft text-primary-active grid place-items-center rounded-full border",
        mediaSizeClassNames[size]
      )}
    >
      {icon}
    </div>
  ) : null;

  return (
    <section
      className={cn(
        "border-border bg-surface text-text grid min-w-0 justify-items-center rounded-lg border border-dashed text-center",
        rootSizeClassNames[size],
        className
      )}
      {...props}
    >
      {media}

      <div className="grid w-[min(100%,32rem)] gap-1">
        <h2
          className={cn(
            "text-text m-0 leading-snug font-extrabold",
            titleSizeClassNames[size]
          )}
        >
          {title}
        </h2>
        {description ? (
          <p className="text-muted m-0 text-sm leading-snug">{description}</p>
        ) : null}
      </div>

      {action ? (
        <div className="flex flex-wrap justify-center gap-2">{action}</div>
      ) : null}
    </section>
  );
}
