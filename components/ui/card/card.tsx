"use client";

import {
  Box,
  Card as MantineCard,
  type CardProps as MantineCardProps,
} from "@mantine/core";
import { cn, interactiveTransitionClassName } from "@/lib/class-names";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Button } from "../button";

export type AppCardImageProps = Omit<
  ComponentPropsWithoutRef<"img">,
  "alt" | "className" | "src"
>;

export type AppCardProps = Omit<MantineCardProps, "children" | "title"> & {
  title: ReactNode;
  description?: ReactNode;
  price?: ReactNode;
  actionLabel?: ReactNode;
  actionDisabled?: boolean;
  imageAlt?: string;
  imageLabel?: ReactNode;
  imageProps?: AppCardImageProps;
  imageSrc?: string;
  onAction?: () => void;
};

export function Card({
  actionDisabled,
  actionLabel,
  className,
  description,
  imageAlt,
  imageLabel,
  imageProps,
  imageSrc,
  onAction,
  price,
  title,
  ...props
}: AppCardProps) {
  return (
    <MantineCard
      className={cn(
        "flex min-h-[368px] overflow-hidden rounded-xl border border-border bg-background text-text hover:border-primary-hover active:border-primary-active",
        interactiveTransitionClassName,
        className,
      )}
      padding={0}
      {...props}
    >
      <div className="relative grid aspect-[4/3] h-[216px] max-h-[216px] min-h-[216px] overflow-hidden bg-surface [background-image:repeating-linear-gradient(135deg,color-mix(in_srgb,var(--app-color-primary)_12%,transparent)_0_22px,transparent_22px_44px)] place-items-center">
        {imageSrc ? (
          <Box
            alt={imageAlt ?? ""}
            className="block h-full max-h-[216px] w-full object-cover"
            component="img"
            src={imageSrc}
            {...imageProps}
          />
        ) : (
          <span className="max-w-[calc(100%-40px)] rounded-lg bg-white/85 px-2.5 py-1.5 text-center text-xs leading-tight text-muted">
            {imageLabel ?? "Photo placeholder"}
          </span>
        )}
      </div>

      <div className="grid flex-1 gap-md p-[22px_18px_18px]">
        <div className="grid content-start gap-xs">
          <h3 className="m-0 text-lg font-extrabold leading-snug text-text">
            {title}
          </h3>
          {description ? (
            <p className="m-0 text-sm leading-snug text-muted">{description}</p>
          ) : null}
        </div>

        {(price || actionLabel) && (
          <div className="flex items-center justify-between gap-sm self-end">
            {price ? (
              <span className="text-xl font-black leading-tight text-text">
                {price}
              </span>
            ) : (
              <span />
            )}
            {actionLabel ? (
              <Button
                disabled={actionDisabled}
                onClick={onAction}
                size="sm"
                variant="dark"
              >
                {actionLabel}
              </Button>
            ) : null}
          </div>
        )}
      </div>
    </MantineCard>
  );
}
