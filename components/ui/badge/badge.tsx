"use client";

import { Badge as MantineBadge, type BadgeProps } from "@mantine/core";
import { cn } from "@/lib/class-names";
import type { ReactNode } from "react";

export type AppBadgeTone =
  | "primary"
  | "success"
  | "info"
  | "warning"
  | "failed"
  | "danger"
  | "neutral";

export type AppBadgeVariant = "soft" | "filled" | "outline";

export type AppBadgePadding = "compact" | "default" | "comfortable";

export type AppBadgeProps = Omit<
  BadgeProps,
  "children" | "color" | "variant"
> & {
  children: ReactNode;
  padding?: AppBadgePadding;
  tone?: AppBadgeTone;
  variant?: AppBadgeVariant;
};

const toneMap: Record<AppBadgeTone, string> = {
  danger: "tomato",
  failed: "failed",
  info: "info",
  neutral: "dough",
  primary: "brand",
  success: "success",
  warning: "warning",
};

const variantMap: Record<AppBadgeVariant, BadgeProps["variant"]> = {
  filled: "filled",
  outline: "outline",
  soft: "light",
};

const paddingClassNames: Record<AppBadgePadding, string> = {
  compact: "!px-2",
  default: "!px-2.5",
  comfortable: "!px-3.5",
};

const toneClassNames: Record<AppBadgeTone, string> = {
  danger: "",
  failed: "",
  info: "",
  neutral:
    "data-[variant=light]:!bg-secondary-soft data-[variant=light]:!text-secondary data-[variant=outline]:!border-border data-[variant=outline]:!text-secondary",
  primary: "",
  success: "",
  warning:
    "data-[variant=filled]:!text-warning-contrast data-[variant=light]:!text-warning-active",
};

export function Badge({
  children,
  className,
  size = "lg",
  tone = "primary",
  variant = "soft",
  padding = "default",
  ...props
}: AppBadgeProps) {
  return (
    <MantineBadge
      className={cn(
        "inline-flex max-w-full shrink-0 align-middle normal-case",
        paddingClassNames[padding],
        toneClassNames[tone],
        className,
      )}
      color={toneMap[tone]}
      variant={variantMap[variant]}
      size={size}
      {...props}
    >
      {children}
    </MantineBadge>
  );
}
