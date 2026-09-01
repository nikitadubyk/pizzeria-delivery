"use client";

import { useField } from "formik";

import { Toggle, type AppToggleProps } from "../toggle";
import { controlError } from "./control-error";

export type ToggleFieldProps = Omit<
  AppToggleProps,
  "name" | "error" | "value" | "checked" | "defaultChecked"
> & {
  name: string;
};

export const ToggleField = ({
  name,
  onBlur,
  onChange,
  ...toggleProps
}: ToggleFieldProps) => {
  const [field, meta] = useField<boolean>({ name, type: "checkbox" });

  const handleBlur: NonNullable<AppToggleProps["onBlur"]> = (event) => {
    field.onBlur(event);
    onBlur?.(event);
  };

  const handleChange: NonNullable<AppToggleProps["onChange"]> = (event) => {
    field.onChange(event);
    onChange?.(event);
  };

  return (
    <Toggle
      {...toggleProps}
      checked={Boolean(field.checked)}
      error={controlError(meta)}
      name={name}
      onBlur={handleBlur}
      onChange={handleChange}
    />
  );
};
