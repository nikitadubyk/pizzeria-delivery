"use client";

import {
  Radio as MantineRadio,
  type RadioGroupProps as MantineRadioGroupProps,
  type RadioProps,
} from "@mantine/core";
import { cn, interactiveTransitionClassName } from "@/lib/class-names";
import type { ReactNode } from "react";

const radioRootClassName = cn(
  "group/radio cursor-pointer hover:text-primary-active hover:[&_.mantine-Radio-description]:!text-primary-active hover:[&_.mantine-Radio-label]:!text-primary-active hover:[&_.mantine-Radio-radio]:!border-primary-hover hover:[&_.mantine-Radio-radio]:!bg-primary-soft has-[input:checked]:hover:[&_.mantine-Radio-radio]:!border-primary has-[input:checked]:hover:[&_.mantine-Radio-radio]:!bg-primary has-[input:disabled]:cursor-not-allowed has-[input:disabled]:hover:text-text has-[input:disabled]:hover:[&_.mantine-Radio-description]:!text-muted has-[input:disabled]:hover:[&_.mantine-Radio-label]:!text-text has-[input:disabled]:hover:[&_.mantine-Radio-radio]:!border-border has-[input:disabled]:hover:[&_.mantine-Radio-radio]:!bg-transparent",
  interactiveTransitionClassName,
);
const radioSlotClassNames = {
  body: "!cursor-pointer group-has-[input:disabled]/radio:!cursor-not-allowed",
  description: cn(
    "!cursor-pointer select-none !text-muted group-hover/radio:!text-primary-active group-has-[input:disabled]/radio:!cursor-not-allowed group-has-[input:disabled]/radio:!text-muted group-has-[input:disabled]/radio:group-hover/radio:!text-muted",
    interactiveTransitionClassName,
  ),
  label: cn(
    "!cursor-pointer select-none group-hover/radio:!text-primary-active group-has-[input:disabled]/radio:!cursor-not-allowed group-has-[input:disabled]/radio:group-hover/radio:!text-text",
    interactiveTransitionClassName,
  ),
  labelWrapper:
    "!cursor-pointer group-has-[input:disabled]/radio:!cursor-not-allowed",
  radio: cn(
    "!cursor-pointer hover:!border-primary-hover hover:!bg-primary-soft checked:hover:!border-primary checked:hover:!bg-primary disabled:!cursor-not-allowed",
    interactiveTransitionClassName,
  ),
};
const radioCardClassName = cn(
  "group/card relative flex w-full cursor-pointer items-center rounded-[14px] border !border-border !bg-background text-left text-text !shadow-[0_1px_3px_rgb(36_25_17_/_10%)] hover:!border-primary-hover hover:!bg-primary-soft hover:!text-primary-active active:!border-primary-active focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-active data-[checked]:!border-primary data-[checked]:!bg-primary-soft data-[checked]:!text-primary-active aria-[checked=true]:!border-primary aria-[checked=true]:!bg-primary-soft aria-[checked=true]:!text-primary-active [&:has(input:checked)]:!border-primary [&:has(input:checked)]:!bg-primary-soft [&:has(input:checked)]:!text-primary-active disabled:!cursor-not-allowed disabled:opacity-60 disabled:hover:!border-border disabled:hover:!bg-background disabled:hover:!text-text disabled:[&_*]:!cursor-not-allowed data-[disabled]:!cursor-not-allowed data-[disabled]:opacity-60 data-[disabled]:hover:!border-border data-[disabled]:hover:!bg-background data-[disabled]:hover:!text-text data-[disabled]:[&_*]:!cursor-not-allowed aria-disabled:!cursor-not-allowed aria-disabled:opacity-60 aria-disabled:hover:!border-border aria-disabled:hover:!bg-background aria-disabled:hover:!text-text aria-disabled:[&_*]:!cursor-not-allowed",
  interactiveTransitionClassName,
);
const radioCardPaddingClassNames = {
  compact: "!min-h-[44px] !px-4 !py-2",
  comfortable: "!min-h-[64px] !px-5 !py-4",
  dense: "!min-h-[40px] !p-2",
};

export function Radio({ className, classNames, ...props }: RadioProps) {
  const mergedClassNames =
    typeof classNames === "function"
      ? classNames
      : {
          ...classNames,
          body: cn(radioSlotClassNames.body, classNames?.body),
          description: cn(
            radioSlotClassNames.description,
            classNames?.description,
          ),
          label: cn(radioSlotClassNames.label, classNames?.label),
          labelWrapper: cn(
            radioSlotClassNames.labelWrapper,
            classNames?.labelWrapper,
          ),
          radio: cn(radioSlotClassNames.radio, classNames?.radio),
        };

  return (
    <MantineRadio
      className={cn(radioRootClassName, className)}
      classNames={mergedClassNames}
      {...props}
    />
  );
}

export type RadioGroupOption = {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
};

export type RadioGroupCardPadding = keyof typeof radioCardPaddingClassNames;

export type RadioGroupProps = Omit<MantineRadioGroupProps, "children"> & {
  cardPadding?: RadioGroupCardPadding;
  options: RadioGroupOption[];
};

export function RadioGroup({
  cardPadding = "compact",
  disabled,
  options,
  ...props
}: RadioGroupProps) {
  return (
    <MantineRadio.Group disabled={disabled} {...props}>
      <div className="grid w-full min-w-0 gap-3 md:grid-cols-3">
        {options.map((option) => {
          const isDisabled = disabled || option.disabled;

          return (
            <MantineRadio.Card
              key={option.value}
              value={option.value}
              disabled={isDisabled}
              withBorder={false}
              className={cn(
                radioCardClassName,
                radioCardPaddingClassNames[cardPadding],
              )}
            >
              <span className="flex w-full min-w-0 items-center gap-sm">
                <MantineRadio.Indicator
                  className={cn(
                    "shrink-0 group-hover/card:[&:not([data-checked])]:!border-primary-hover group-hover/card:[&:not([data-checked])]:!bg-primary-soft",
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
            </MantineRadio.Card>
          );
        })}
      </div>
    </MantineRadio.Group>
  );
}
