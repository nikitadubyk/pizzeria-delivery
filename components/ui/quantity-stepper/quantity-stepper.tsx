"use client";

import { IconMinus, IconPlus } from "@tabler/icons-react";
import { cn, interactiveMotionTransitionClassName } from "@/lib/class-names";
import type { ComponentPropsWithoutRef } from "react";

export type QuantityStepperSize = "sm" | "md" | "lg";

export type QuantityStepperProps = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  decrementLabel?: string;
  disabled?: boolean;
  incrementLabel?: string;
  max?: number;
  min?: number;
  onChange: (value: number) => void;
  size?: QuantityStepperSize;
  step?: number;
  value: number;
};

const rootSizeClassNames: Record<QuantityStepperSize, string> = {
  sm: "h-9",
  md: "h-11",
  lg: "h-12",
};

const buttonSizeClassNames: Record<QuantityStepperSize, string> = {
  sm: "size-9",
  md: "size-11",
  lg: "size-12",
};

const valueSizeClassNames: Record<QuantityStepperSize, string> = {
  sm: "min-w-9 px-2 text-sm",
  md: "min-w-11 px-3 text-md",
  lg: "min-w-12 px-4 text-lg",
};

const iconSize: Record<QuantityStepperSize, number> = {
  sm: 16,
  md: 18,
  lg: 20,
};

function clampValue(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function QuantityStepper({
  className,
  decrementLabel = "Уменьшить количество",
  disabled = false,
  incrementLabel = "Увеличить количество",
  max = 99,
  min = 0,
  onChange,
  size = "md",
  step = 1,
  value,
  ...props
}: QuantityStepperProps) {
  const normalizedStep = Math.max(step, 1);
  const normalizedMin = Math.min(min, max);
  const normalizedValue = clampValue(value, normalizedMin, max);
  const canDecrement = !disabled && normalizedValue > normalizedMin;
  const canIncrement = !disabled && normalizedValue < max;

  const handleChange = (nextValue: number) => {
    const clampedValue = clampValue(nextValue, normalizedMin, max);

    if (clampedValue !== normalizedValue) {
      onChange(clampedValue);
    }
  };

  return (
    <div
      className={cn(
        "inline-grid w-max shrink-0 grid-cols-[auto_auto_auto] items-center overflow-hidden rounded-full border border-border bg-background text-text shadow-sm",
        rootSizeClassNames[size],
        disabled && "opacity-60",
        className,
      )}
      {...props}
    >
      <button
        aria-label={decrementLabel}
        className={cn(
          "grid place-items-center border-r border-border text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary-active enabled:cursor-pointer enabled:hover:bg-primary-soft enabled:hover:text-primary-active enabled:active:bg-primary enabled:active:text-primary-contrast disabled:cursor-not-allowed",
          buttonSizeClassNames[size],
          interactiveMotionTransitionClassName,
        )}
        disabled={!canDecrement}
        onClick={() => handleChange(normalizedValue - normalizedStep)}
        type="button"
      >
        <IconMinus aria-hidden="true" size={iconSize[size]} stroke={2.5} />
      </button>

      <output
        aria-live="polite"
        className={cn(
          "select-none text-center font-extrabold tabular-nums leading-none",
          valueSizeClassNames[size],
        )}
      >
        {normalizedValue}
      </output>

      <button
        aria-label={incrementLabel}
        className={cn(
          "grid place-items-center border-l border-border text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary-active enabled:cursor-pointer enabled:hover:bg-primary-soft enabled:hover:text-primary-active enabled:active:bg-primary enabled:active:text-primary-contrast disabled:cursor-not-allowed",
          buttonSizeClassNames[size],
          interactiveMotionTransitionClassName,
        )}
        disabled={!canIncrement}
        onClick={() => handleChange(normalizedValue + normalizedStep)}
        type="button"
      >
        <IconPlus aria-hidden="true" size={iconSize[size]} stroke={2.5} />
      </button>
    </div>
  );
}
