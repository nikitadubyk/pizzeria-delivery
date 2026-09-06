"use client";

import { useField } from "formik";
import { PasswordInput, type AppPasswordInputProps } from "../input";
import { controlError } from "./control-error";

export type PasswordFieldProps = Omit<
  AppPasswordInputProps,
  "name" | "error" | "value" | "defaultValue"
> & {
  name: string;
};

export function PasswordField({ name, onBlur, onChange, ...props }: PasswordFieldProps) {
  const [field, meta] = useField<string>(name);

  return (
    <PasswordInput
      {...props}
      {...field}
      error={controlError(meta)}
      onBlur={event => {
        field.onBlur(event);
        onBlur?.(event);
      }}
      onChange={event => {
        field.onChange(event);
        onChange?.(event);
      }}
    />
  );
}
