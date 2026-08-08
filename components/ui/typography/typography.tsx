"use client";

import { cn } from "@/lib/class-names";
import type { HTMLAttributes, ReactNode } from "react";

export type TypographyVariant =
  | "body"
  | "bodySm"
  | "caption"
  | "display"
  | "eyebrow"
  | "h1"
  | "h2"
  | "h3"
  | "h4";

type TypographyElement = "h1" | "h2" | "h3" | "h4" | "p" | "span";

export type TypographyProps = HTMLAttributes<HTMLElement> & {
  as?: TypographyElement;
  children: ReactNode;
  muted?: boolean;
  variant?: TypographyVariant;
};

const defaultElementByVariant: Record<TypographyVariant, TypographyElement> = {
  body: "p",
  bodySm: "p",
  caption: "span",
  display: "h1",
  eyebrow: "span",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
};

const variantClassNames: Record<TypographyVariant, string> = {
  body: "text-md font-normal leading-normal",
  bodySm: "text-sm font-normal leading-snug",
  caption: "text-xs font-bold leading-tight",
  display: "text-4xl font-black leading-tight",
  eyebrow: "text-xs font-extrabold uppercase leading-tight text-muted",
  h1: "text-4xl font-black leading-tight",
  h2: "text-3xl font-black leading-tight",
  h3: "text-2xl font-extrabold leading-snug",
  h4: "text-xl font-extrabold leading-snug",
};

export function Typography({
  as,
  children,
  className,
  muted,
  variant = "body",
  ...props
}: TypographyProps) {
  const Component = as ?? defaultElementByVariant[variant];

  return (
    <Component
      className={cn(
        "m-0 font-sans tracking-normal text-text",
        variantClassNames[variant],
        muted && "text-muted",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
