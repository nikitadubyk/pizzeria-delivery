"use client";

import { useField } from "formik";

import { Input, type AppInputProps } from "../input";
import { controlError } from "./control-error";

type InputFieldValue = string | number;

export type InputFieldProps = Omit<
  AppInputProps,
  "name" | "error" | "value" | "defaultValue"
> & {
  name: string;
};

export const InputField = ({
  name,
  onBlur,
  onChange,
  ...inputProps
}: InputFieldProps) => {
  const [field, meta] = useField<InputFieldValue>(name);

  const handleBlur: NonNullable<AppInputProps["onBlur"]> = (event) => {
    field.onBlur(event);
    onBlur?.(event);
  };

  const handleChange: NonNullable<AppInputProps["onChange"]> = (event) => {
    field.onChange(event);
    onChange?.(event);
  };

  return (
    <Input
      {...inputProps}
      error={controlError(meta)}
      name={name}
      onBlur={handleBlur}
      onChange={handleChange}
      value={field.value}
    />
  );
};
