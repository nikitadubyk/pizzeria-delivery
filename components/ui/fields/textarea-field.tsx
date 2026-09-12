"use client";

import { useField } from "formik";

import { Textarea, type AppTextareaProps } from "../textarea";
import { controlError } from "./control-error";

export type TextareaFieldProps = Omit<
  AppTextareaProps,
  "name" | "error" | "value" | "defaultValue"
> & {
  name: string;
};

export function TextareaField({
  name,
  onBlur,
  onChange,
  ...textareaProps
}: TextareaFieldProps) {
  const [field, meta] = useField<string>(name);

  const handleBlur: NonNullable<AppTextareaProps["onBlur"]> = (event) => {
    field.onBlur(event);
    onBlur?.(event);
  };
  const handleChange: NonNullable<AppTextareaProps["onChange"]> = (event) => {
    field.onChange(event);
    onChange?.(event);
  };

  return (
    <Textarea
      {...textareaProps}
      error={controlError(meta)}
      name={name}
      onBlur={handleBlur}
      onChange={handleChange}
      value={field.value}
    />
  );
}
