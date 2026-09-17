"use client";

import { useField } from "formik";
import { isValidPriceInput } from "@/lib/price";
import { Input, type AppInputProps } from "../input";
import { controlError } from "./control-error";

export type PriceInputFieldProps = Omit<
  AppInputProps,
  "name" | "error" | "value" | "defaultValue" | "type" | "inputMode" | "onChange"
> & { name: string };

export function PriceInputField({ name, onBlur, ...props }: PriceInputFieldProps) {
  const [field, meta, helpers] = useField<string | number>(name);

  return (
    <Input
      {...props}
      error={controlError(meta)}
      inputMode="decimal"
      name={name}
      onBlur={(event) => {
        field.onBlur(event);
        onBlur?.(event);
      }}
      onChange={(event) => {
        const nextValue = event.currentTarget.value;
        if (isValidPriceInput(nextValue)) {
          void helpers.setValue(nextValue.replace(",", "."));
        }
      }}
      type="text"
      value={field.value ?? ""}
    />
  );
}
