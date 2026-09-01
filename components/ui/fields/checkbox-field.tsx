"use client";

import { useField } from "formik";

import { Checkbox, type AppCheckboxProps } from "../checkbox";
import { controlError } from "./control-error";

type CheckboxValue = string | number;
type CheckboxFormValue = boolean | CheckboxValue | CheckboxValue[];

export type CheckboxFieldProps = Omit<
  AppCheckboxProps,
  "name" | "error" | "value" | "checked" | "defaultChecked"
> & {
  name: string;
  value?: CheckboxValue;
};

export const CheckboxField = ({
  id,
  name,
  onBlur,
  onChange,
  value,
  ...checkboxProps
}: CheckboxFieldProps) => {
  const [field, meta, helpers] = useField<CheckboxFormValue>({
    name,
    type: "checkbox",
    value,
  });
  const checked =
    value === undefined
      ? Boolean(meta.value)
      : Array.isArray(meta.value) && meta.value.includes(value);
  const fieldId =
    id ??
    (value === undefined
      ? name
      : `${name}-${encodeURIComponent(String(value))}`);

  const handleBlur: NonNullable<AppCheckboxProps["onBlur"]> = (event) => {
    field.onBlur(event);
    onBlur?.(event);
  };

  const handleChange: NonNullable<AppCheckboxProps["onChange"]> = (event) => {
    if (value === undefined) {
      field.onChange(event);
    } else {
      const selectedValues = Array.isArray(meta.value) ? meta.value : [];
      const isSelected = selectedValues.includes(value);
      const shouldSelect = event.currentTarget.checked;
      const nextValue = shouldSelect
        ? isSelected
          ? selectedValues
          : [...selectedValues, value]
        : selectedValues.filter((selectedValue) => selectedValue !== value);

      if (nextValue !== selectedValues) {
        void helpers.setValue(nextValue);
      }
    }

    onChange?.(event);
  };

  return (
    <Checkbox
      {...checkboxProps}
      checked={checked}
      error={controlError(meta)}
      id={fieldId}
      name={name}
      onBlur={handleBlur}
      onChange={handleChange}
      value={value}
    />
  );
};
