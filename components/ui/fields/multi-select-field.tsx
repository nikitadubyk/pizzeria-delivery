"use client";

import { MultiSelect, type MultiSelectProps } from "@mantine/core";
import { useField } from "formik";

import {
  cn,
  interactiveMotionTransitionClassName,
  interactiveTransitionClassName,
} from "@/lib/class-names";

import { controlError } from "./control-error";

export type MultiSelectFieldProps = Omit<
  MultiSelectProps,
  "name" | "error" | "value" | "defaultValue"
> & {
  name: string;
};

export function MultiSelectField({
  classNames,
  comboboxProps,
  name,
  nothingFoundMessage = "Ничего не найдено",
  onBlur,
  onChange,
  radius = "md",
  size = "md",
  ...props
}: MultiSelectFieldProps) {
  const [field, meta, helpers] = useField<string[]>(name);
  const mergedClassNames =
    typeof classNames === "function"
      ? classNames
      : {
          ...classNames,
          description: cn(
            "text-sm leading-snug text-muted",
            classNames?.description
          ),
          dropdown: cn(
            "!overflow-hidden !rounded-[12px] !border-border !p-1 shadow-[0_10px_24px_rgb(36_25_17_/_10%)]",
            classNames?.dropdown
          ),
          empty: cn("text-sm text-muted", classNames?.empty),
          input: cn(
            "min-h-11 !cursor-pointer !rounded-[12px] !border-border !bg-background !px-3 !text-text hover:!border-primary-hover hover:!bg-primary-soft focus:!border-primary-active focus:!shadow-[0_0_0_2px_var(--app-color-primary-soft)] disabled:!cursor-not-allowed disabled:hover:!border-border disabled:hover:!bg-background",
            interactiveMotionTransitionClassName,
            classNames?.input
          ),
          label: cn("font-extrabold leading-snug text-text", classNames?.label),
          option: cn(
            "!cursor-pointer !rounded-lg !px-3 !py-2 text-sm leading-snug !text-text hover:!bg-primary-soft hover:!text-primary-active data-[combobox-disabled]:!cursor-not-allowed data-[combobox-disabled]:opacity-50 data-[combobox-disabled]:hover:!bg-transparent data-[combobox-disabled]:hover:!text-text data-[combobox-selected]:!bg-primary data-[combobox-selected]:!text-primary-contrast",
            interactiveTransitionClassName,
            classNames?.option
          ),
          pill: cn("!bg-primary-soft !text-primary-active", classNames?.pill),
          root: cn(
            "group/multi-select text-text hover:[&_.mantine-MultiSelect-label]:!text-primary-active has-[input:disabled]:cursor-not-allowed has-[input:disabled]:hover:[&_.mantine-MultiSelect-label]:!text-text",
            classNames?.root
          ),
        };

  return (
    <MultiSelect
      {...props}
      classNames={mergedClassNames}
      comboboxProps={{
        dropdownPadding: 4,
        offset: 6,
        width: "target",
        ...comboboxProps,
      }}
      error={controlError(meta)}
      name={name}
      nothingFoundMessage={nothingFoundMessage}
      onBlur={(event) => {
        field.onBlur(event);
        onBlur?.(event);
      }}
      onChange={(value) => {
        void helpers.setValue(value);
        onChange?.(value);
      }}
      radius={radius}
      size={size}
      value={field.value}
    />
  );
}
