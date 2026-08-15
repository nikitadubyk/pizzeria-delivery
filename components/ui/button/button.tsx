"use client";

import {
  Button as MantineButton,
  createPolymorphicComponent,
  type ButtonProps,
} from "@mantine/core";
import { cn, interactiveMotionTransitionClassName } from "@/lib/class-names";
import { forwardRef, type ReactNode } from "react";

export type AppButtonVariant = "primary" | "secondary" | "ghost" | "dark";

export type AppButtonProps = Omit<ButtonProps, "color" | "variant"> & {
  variant?: AppButtonVariant;
  children: ReactNode;
};

const variantMap: Record<AppButtonVariant, Pick<ButtonProps, "variant" | "color">> = {
  primary: { variant: "filled", color: "brand" },
  secondary: { variant: "outline", color: "dough" },
  ghost: { variant: "subtle", color: "dough" },
  dark: { variant: "filled", color: "dough" },
};

const ButtonBase = forwardRef<HTMLButtonElement, AppButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "md",
      children,
      className,
      ...props
    },
    ref,
  ) {
    return (
      <MantineButton
        className={cn(
          "cursor-pointer shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-active hover:-translate-y-px hover:shadow-md active:translate-y-0 active:shadow-sm disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-sm",
          interactiveMotionTransitionClassName,
          className,
        )}
        ref={ref}
        size={size}
        {...variantMap[variant]}
        {...props}
      >
        {children}
      </MantineButton>
    );
  },
);

export const Button = createPolymorphicComponent<"button", AppButtonProps>(
  ButtonBase,
);
