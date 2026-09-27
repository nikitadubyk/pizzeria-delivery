"use client";

import { useField } from "formik";

import { PhoneInput, type AppPhoneInputProps } from "../phone-input";
import { controlError } from "./control-error";

export type PhoneInputFieldProps = Omit<
  AppPhoneInputProps,
  "name" | "error" | "value"
> & {
  name: string;
};

export function PhoneInputField({
  name,
  onBlur,
  onChange,
  ...phoneInputProps
}: PhoneInputFieldProps) {
  const [field, meta, helpers] = useField<string>(name);

  const handleBlur: NonNullable<AppPhoneInputProps["onBlur"]> = (event) => {
    field.onBlur(event);
    onBlur?.(event);
  };

  const handleChange: NonNullable<AppPhoneInputProps["onChange"]> = (value) => {
    void helpers.setValue(value ?? "");
    onChange?.(value);
  };

  return (
    <PhoneInput
      {...phoneInputProps}
      error={controlError(meta)}
      name={name}
      onBlur={handleBlur}
      onChange={handleChange}
      value={field.value}
    />
  );
}
