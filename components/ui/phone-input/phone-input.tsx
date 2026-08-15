"use client";

import { Input as MantineInput } from "@mantine/core";
import FormattedInput from "input-format/react";
import type { Value } from "react-phone-number-input/input";
import { cn } from "@/lib/class-names";

import { AppPhoneInputProps } from "./types";
import {
  parseRussianPhone,
  wrapperClassNames,
  formatRussianPhone,
  phoneInputRootClassName,
  getRussianNationalNumber,
} from "./config";

export function PhoneInput({
  id,
  name,
  error,
  label,
  value,
  onBlur,
  onFocus,
  disabled,
  onChange,
  required,
  className,
  description,
  withAsterisk,
  inputClassName,
  placeholder = "+7 (999) 123-45-67",
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
        id={id}
        type="tel"
        name={name}
        inputMode="tel"
        onBlur={onBlur}
        onFocus={onFocus}
        disabled={disabled}
        parse={parseRussianPhone}
        placeholder={placeholder}
        format={formatRussianPhone}
        value={getRussianNationalNumber(value)}
        aria-invalid={Boolean(error) || undefined}
        onChange={(nationalNumber) =>
          onChange?.(
            nationalNumber ? (`+7${nationalNumber}` as Value) : undefined,
          )
        }
        className={cn(
          phoneInputRootClassName,
          Boolean(error)
            ? "border-danger! focus-within:border-danger! focus-within:shadow-[0_0_0_2px_var(--app-color-danger-soft)]!"
            : undefined,
          inputClassName,
          className,
        )}
      />
    </MantineInput.Wrapper>
  );
}
