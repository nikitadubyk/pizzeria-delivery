"use client";

import {
  Checkbox as MantineCheckbox,
  type CheckboxGroupProps as MantineCheckboxGroupProps,
  type CheckboxProps,
} from "@mantine/core";
import type { ReactNode } from "react";

export function Checkbox(props: CheckboxProps) {
  return <MantineCheckbox {...props} />;
}

export type CheckboxGroupOption = {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
};

export type CheckboxGroupProps = Omit<MantineCheckboxGroupProps, "children"> & {
  options: CheckboxGroupOption[];
};

export function CheckboxGroup({ options, ...props }: CheckboxGroupProps) {
  return (
    <MantineCheckbox.Group {...props}>
      <div className="grid gap-3 md:grid-cols-3">
        {options.map((option) => (
          <MantineCheckbox
            key={option.value}
            value={option.value}
            disabled={option.disabled}
            label={option.label}
            description={option.description}
            className="rounded-xl border border-border bg-background px-4 py-3 shadow-sm transition hover:-translate-y-px hover:border-primary-hover hover:shadow-md"
          />
        ))}
      </div>
    </MantineCheckbox.Group>
  );
}
