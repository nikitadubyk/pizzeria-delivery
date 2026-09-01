"use client";

import { useField } from "formik";

import { Select, type AppSelectProps } from "../select";
import { controlError } from "./control-error";

type SelectFieldValue = string | null;

export type SelectFieldProps = Omit<
  AppSelectProps,
  "name" | "error" | "value" | "defaultValue"
> & {
  name: string;
};

export const SelectField = ({
  name,
  onBlur,
  onChange,
  ...selectProps
}: SelectFieldProps) => {
  const [field, meta, helpers] = useField<SelectFieldValue>(name);

  const handleBlur: NonNullable<AppSelectProps["onBlur"]> = (event) => {
    field.onBlur(event);
    onBlur?.(event);
  };

  const handleChange: NonNullable<AppSelectProps["onChange"]> = (
    value,
    option,
  ) => {
    void helpers.setValue(value);
    onChange?.(value, option);
  };

  return (
    <Select
      {...selectProps}
      error={controlError(meta)}
      name={name}
      onBlur={handleBlur}
      onChange={handleChange}
      value={field.value}
    />
  );
};
