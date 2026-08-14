"use client";

import { Input as MantineInput, type InputWrapperProps } from "@mantine/core";
import {
  parseDigit,
  templateFormatter,
  templateParser,
} from "input-format";
import FormattedInput from "input-format/react";
import type { Value } from "react-phone-number-input/input";
import { cn, interactiveMotionTransitionClassName } from "@/lib/class-names";

export type PhoneInputValue = Value | undefined;

export type AppPhoneInputProps = {
  className?: string;
  description?: InputWrapperProps["description"];
  disabled?: boolean;
  error?: InputWrapperProps["error"];
  id?: string;
  inputClassName?: string;
  label?: InputWrapperProps["label"];
  name?: string;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onChange?: (value: PhoneInputValue) => void;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  placeholder?: string;
  required?: boolean;
  value?: PhoneInputValue | string;
  withAsterisk?: InputWrapperProps["withAsterisk"];
};

const phoneInputRootClassName = cn(
  "h-11 w-full min-w-0 rounded-xl border border-border bg-background px-3 text-md text-text outline-none placeholder:text-muted hover:border-primary-hover hover:bg-primary-soft focus:border-primary-active focus:shadow-[0_0_0_2px_var(--app-color-primary-soft)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:border-border disabled:hover:bg-background",
  interactiveMotionTransitionClassName,
);

const wrapperClassNames = {
  description: "!mb-3 text-sm leading-snug !text-muted",
  error: "!text-danger",
  label: "mb-1 font-extrabold leading-snug !text-text",
  root: "w-full min-w-0",
};

const russianPhoneTemplate = "+7 (xxx) xxx-xx-xx";
const formatRussianPhone = templateFormatter(russianPhoneTemplate);
const parseRussianPhone = templateParser(
  russianPhoneTemplate,
  (character, value) => {
    const digit = parseDigit(character);

    if (value.length === 0 && (digit === "7" || digit === "8")) {
      return undefined;
    }

    return digit;
  },
);

function getRussianNationalNumber(value?: PhoneInputValue | string) {
  const digits = value?.replace(/\D/g, "") ?? "";
  const nationalDigits =
    digits.startsWith("7") || digits.startsWith("8")
      ? digits.slice(1)
      : digits;

  return nationalDigits.slice(0, 10);
}

export function PhoneInput({
  className,
  description,
  disabled,
  error,
  id,
  inputClassName,
  label,
  name,
  onBlur,
  onChange,
  onFocus,
  placeholder = "+7 (999) 123-45-67",
  required,
  value,
  withAsterisk,
}: AppPhoneInputProps) {
  return (
    <MantineInput.Wrapper
      classNames={wrapperClassNames}
      description={description}
      error={error}
      id={id}
      label={label}
      required={required}
      withAsterisk={withAsterisk}
    >
      <FormattedInput
        className={cn(
          phoneInputRootClassName,
          Boolean(error)
            ? "!border-danger focus-within:!border-danger focus-within:!shadow-[0_0_0_2px_var(--app-color-danger-soft)]"
            : undefined,
          inputClassName,
          className,
        )}
        disabled={disabled}
        format={formatRussianPhone}
        id={id}
        inputMode="tel"
        name={name}
        aria-invalid={Boolean(error) || undefined}
        onBlur={onBlur}
        onChange={(nationalNumber) =>
          onChange?.(
            nationalNumber ? (`+7${nationalNumber}` as Value) : undefined,
          )
        }
        onFocus={onFocus}
        parse={parseRussianPhone}
        placeholder={placeholder}
        type="tel"
        value={getRussianNationalNumber(value)}
      />
    </MantineInput.Wrapper>
  );
}
