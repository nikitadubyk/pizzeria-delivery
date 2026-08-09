"use client";

import { IconTrash } from "@tabler/icons-react";
import {
  cn,
  interactiveMotionTransitionClassName,
  interactiveTransitionClassName,
} from "@/lib/class-names";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { QuantityStepper } from "../quantity-stepper";

export type CartLineItemOption = {
  label: ReactNode;
  value?: ReactNode;
};

export type CartLineItemProps = Omit<
  ComponentPropsWithoutRef<"article">,
  "children" | "title"
> & {
  disabled?: boolean;
  maxQuantity?: number;
  minQuantity?: number;
  onQuantityChange: (quantity: number) => void;
  onRemove?: () => void;
  options?: CartLineItemOption[];
  price: ReactNode;
  quantity: number;
  removeLabel?: string;
  title: ReactNode;
};

export function CartLineItem({
  className,
  disabled = false,
  maxQuantity = 99,
  minQuantity = 1,
  onQuantityChange,
  onRemove,
  options,
  price,
  quantity,
  removeLabel = "Удалить из корзины",
  title,
  ...props
}: CartLineItemProps) {
  return (
    <article
      className={cn(
        "grid min-w-0 gap-4 rounded-lg border border-border bg-background p-4 text-text shadow-sm sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center",
        disabled && "opacity-60",
        interactiveTransitionClassName,
        className,
      )}
      {...props}
    >
      <div className="grid min-w-0 gap-2">
        <h3 className="m-0 truncate text-md font-extrabold leading-snug text-text">
          {title}
        </h3>

        {options?.length ? (
          <dl className="m-0 flex min-w-0 flex-wrap gap-x-3 gap-y-1 text-sm leading-snug text-muted">
            {options.map((option, index) => (
              <div key={index} className="flex min-w-0 gap-1">
                <dt className="shrink-0 font-semibold text-muted">
                  {option.label}
                </dt>
                {option.value ? (
                  <dd className="m-0 min-w-0 truncate text-muted">
                    {option.value}
                  </dd>
                ) : null}
              </div>
            ))}
          </dl>
        ) : null}
      </div>

      <div className="grid min-w-0 grid-cols-[auto_1fr_auto] items-center gap-3 sm:grid-cols-[auto_auto_auto]">
        <QuantityStepper
          disabled={disabled}
          max={maxQuantity}
          min={minQuantity}
          onChange={onQuantityChange}
          size="sm"
          value={quantity}
        />

        <span className="justify-self-end whitespace-nowrap text-lg font-black leading-tight text-text">
          {price}
        </span>

        {onRemove ? (
          <button
            aria-label={removeLabel}
            className={cn(
              "grid size-9 shrink-0 place-items-center rounded-full border border-border text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-active enabled:cursor-pointer enabled:hover:border-danger-hover enabled:hover:bg-danger-soft enabled:hover:text-danger-active enabled:active:border-danger-active disabled:cursor-not-allowed disabled:opacity-60",
              interactiveMotionTransitionClassName,
            )}
            disabled={disabled}
            onClick={onRemove}
            type="button"
          >
            <IconTrash aria-hidden="true" size={18} stroke={2.25} />
          </button>
        ) : null}
      </div>
    </article>
  );
}
