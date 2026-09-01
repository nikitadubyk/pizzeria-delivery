"use client";

import {
  Checkbox as MantineCheckbox,
  type CheckboxGroupProps as MantineCheckboxGroupProps,
  type CheckboxProps,
} from "@mantine/core";
import { cn, interactiveTransitionClassName } from "@/lib/class-names";
import type { ReactNode } from "react";

export type AppCheckboxProps = CheckboxProps;

const checkboxRootClassName = cn(
  "group/checkbox cursor-pointer hover:text-primary-active hover:[&_.mantine-Checkbox-description]:!text-primary-active hover:[&_.mantine-Checkbox-input]:!border-primary-hover hover:[&_.mantine-Checkbox-input]:!bg-primary-soft hover:[&_.mantine-Checkbox-label]:!text-primary-active [&:hover:has(input:checked:not(:disabled))_.mantine-Checkbox-input]:!border-primary [&:hover:has(input:checked:not(:disabled))_.mantine-Checkbox-input]:!bg-primary has-[input:disabled]:cursor-not-allowed has-[input:disabled]:hover:text-text has-[input:disabled]:hover:[&_.mantine-Checkbox-description]:!text-muted has-[input:disabled]:hover:[&_.mantine-Checkbox-input]:!border-[var(--mantine-color-disabled-border)] has-[input:disabled]:hover:[&_.mantine-Checkbox-input]:!bg-[var(--mantine-color-disabled)] has-[input:disabled]:hover:[&_.mantine-Checkbox-label]:!text-text",
  interactiveTransitionClassName,
);
const checkboxSlotClassNames = {
  body: "!cursor-pointer group-has-[input:disabled]/checkbox:!cursor-not-allowed",
  description: cn(
    "!cursor-pointer select-none !text-muted group-hover/checkbox:!text-primary-active group-has-[input:disabled]/checkbox:!cursor-not-allowed group-has-[input:disabled]/checkbox:!text-muted group-has-[input:disabled]/checkbox:group-hover/checkbox:!text-muted",
    interactiveTransitionClassName,
  ),
  input: cn(
    "!cursor-pointer hover:!border-primary-hover hover:!bg-primary-soft checked:hover:!border-primary checked:hover:!bg-primary [&:checked:hover:not(:disabled)]:!border-primary [&:checked:hover:not(:disabled)]:!bg-primary disabled:!cursor-not-allowed disabled:hover:!border-[var(--mantine-color-disabled-border)] disabled:hover:!bg-[var(--mantine-color-disabled)] disabled:checked:hover:!border-[var(--mantine-color-disabled-border)] disabled:checked:hover:!bg-[var(--mantine-color-disabled)]",
    interactiveTransitionClassName,
  ),
  label: cn(
    "!cursor-pointer select-none group-hover/checkbox:!text-primary-active group-has-[input:disabled]/checkbox:!cursor-not-allowed group-has-[input:disabled]/checkbox:group-hover/checkbox:!text-text",
    interactiveTransitionClassName,
  ),
  labelWrapper:
    "!cursor-pointer group-has-[input:disabled]/checkbox:!cursor-not-allowed",
};
const checkboxCardClassName = cn(
  "group/card relative flex w-full cursor-pointer items-center rounded-[14px] border !border-border !bg-background text-left text-text !shadow-[0_1px_3px_rgb(36_25_17_/_10%)] hover:!border-primary-hover hover:!bg-primary-soft hover:!text-primary-active active:!border-primary-active focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-active data-[checked]:!border-primary data-[checked]:!bg-primary-soft data-[checked]:!text-primary-active aria-[checked=true]:!border-primary aria-[checked=true]:!bg-primary-soft aria-[checked=true]:!text-primary-active [&:has(input:checked)]:!border-primary [&:has(input:checked)]:!bg-primary-soft [&:has(input:checked)]:!text-primary-active disabled:!cursor-not-allowed disabled:opacity-60 disabled:hover:!border-border disabled:hover:!bg-background disabled:hover:!text-text disabled:[&_*]:!cursor-not-allowed data-[disabled]:!cursor-not-allowed data-[disabled]:opacity-60 data-[disabled]:hover:!border-border data-[disabled]:hover:!bg-background data-[disabled]:hover:!text-text data-[disabled]:[&_*]:!cursor-not-allowed aria-disabled:!cursor-not-allowed aria-disabled:opacity-60 aria-disabled:hover:!border-border aria-disabled:hover:!bg-background aria-disabled:hover:!text-text aria-disabled:[&_*]:!cursor-not-allowed",
  interactiveTransitionClassName,
);
const checkboxCardPaddingClassNames = {
  compact: "!min-h-[44px] !px-4 !py-2",
  comfortable: "!min-h-[64px] !px-5 !py-4",
  dense: "!min-h-[40px] !p-2",
};

export function Checkbox({ className, classNames, ...props }: AppCheckboxProps) {
  const mergedClassNames =
    typeof classNames === "function"
      ? classNames
      : {
          ...classNames,
          body: cn(checkboxSlotClassNames.body, classNames?.body),
          description: cn(
            checkboxSlotClassNames.description,
            classNames?.description,
          ),
          input: cn(checkboxSlotClassNames.input, classNames?.input),
          label: cn(checkboxSlotClassNames.label, classNames?.label),
          labelWrapper: cn(
            checkboxSlotClassNames.labelWrapper,
            classNames?.labelWrapper,
          ),
        };

  return (
    <MantineCheckbox
      className={cn(checkboxRootClassName, className)}
      classNames={mergedClassNames}
      {...props}
    />
  );
}

export type CheckboxGroupOption = {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
};

export type CheckboxGroupCardPadding =
  keyof typeof checkboxCardPaddingClassNames;

export type CheckboxGroupProps = Omit<MantineCheckboxGroupProps, "children"> & {
  cardPadding?: CheckboxGroupCardPadding;
  options: CheckboxGroupOption[];
};

export function CheckboxGroup({
  cardPadding = "compact",
  disabled,
  options,
  ...props
}: CheckboxGroupProps) {
  return (
    <MantineCheckbox.Group disabled={disabled} {...props}>
      <div className="grid w-full min-w-0 gap-3 md:grid-cols-3">
        {options.map((option) => {
          const isDisabled = disabled || option.disabled;

          return (
            <MantineCheckbox.Card
              key={option.value}
              value={option.value}
              disabled={isDisabled}
              withBorder={false}
              className={cn(
                checkboxCardClassName,
                checkboxCardPaddingClassNames[cardPadding],
              )}
            >
              <span className="flex w-full min-w-0 items-center gap-sm">
                <MantineCheckbox.Indicator
                  className={cn(
                    "shrink-0 group-hover/card:[&:not([data-checked])]:border-primary-hover! group-hover/card:[&:not([data-checked])]:bg-primary-soft! group-data-disabled/card:[&:not([data-checked])]:border-(--mantine-color-disabled-border)! group-data-disabled/card:[&:not([data-checked])]:bg-(--mantine-color-disabled)! group-data-[disabled]/card:group-hover/card:[&:not([data-checked])]:!border-[var(--mantine-color-disabled-border)] group-data-[disabled]/card:group-hover/card:[&:not([data-checked])]:!bg-[var(--mantine-color-disabled)]",
                    interactiveTransitionClassName,
                  )}
                />
                <span className="grid min-w-0 gap-0.5">
                  <span
                    className={cn(
                      "select-none font-extrabold group-hover/card:text-primary-active group-disabled/card:group-hover/card:text-text",
                      interactiveTransitionClassName,
                    )}
                  >
                    {option.label}
                  </span>
                  {option.description ? (
                    <span
                      className={cn(
                        "select-none text-sm text-muted group-hover/card:text-primary-active group-disabled/card:group-hover/card:text-muted",
                        interactiveTransitionClassName,
                      )}
                    >
                      {option.description}
                    </span>
                  ) : null}
                </span>
              </span>
            </MantineCheckbox.Card>
          );
        })}
      </div>
    </MantineCheckbox.Group>
  );
}
