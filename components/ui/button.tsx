"use client";

import { Button as MantineButton, type ButtonProps } from "@mantine/core";
import type { ReactNode } from "react";

export type AppButtonVariant = "primary" | "secondary" | "ghost" | "dark";

export type AppButtonProps = Omit<ButtonProps, "variant" | "color"> & {
  variant?: AppButtonVariant;
  children: ReactNode;
};

const variantMap: Record<AppButtonVariant, Pick<ButtonProps, "variant" | "color">> = {
  primary: { variant: "filled", color: "orange" },
  secondary: { variant: "outline", color: "dough" },
  ghost: { variant: "subtle", color: "dough" },
  dark: { variant: "filled", color: "dough" },
};

export function Button({
  variant = "primary",
  size = "md",
  children,
  className,
  ...props
}: AppButtonProps) {
  return (
    <MantineButton
      className={[
        "shadow-sm transition hover:-translate-y-px hover:shadow-md active:translate-y-0 active:shadow-sm",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      size={size}
      {...variantMap[variant]}
      {...props}
    >
      {children}
    </MantineButton>
  );
}
