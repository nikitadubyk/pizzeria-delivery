"use client";

import {
  Radio as MantineRadio,
  type RadioGroupProps as MantineRadioGroupProps,
  type RadioProps,
} from "@mantine/core";
import type { ReactNode } from "react";

export function Radio(props: RadioProps) {
  return <MantineRadio {...props} />;
}

export type RadioGroupOption = {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
};

export type RadioGroupProps = Omit<MantineRadioGroupProps, "children"> & {
  options: RadioGroupOption[];
};

export function RadioGroup({ options, ...props }: RadioGroupProps) {
  return (
    <MantineRadio.Group {...props}>
      <div className="grid gap-3 md:grid-cols-3">
        {options.map((option) => (
          <MantineRadio
            key={option.value}
            value={option.value}
            disabled={option.disabled}
            label={option.label}
            description={option.description}
            className="rounded-xl border border-border bg-background px-4 py-3 shadow-sm transition hover:-translate-y-px hover:border-primary-hover hover:shadow-md"
          />
        ))}
      </div>
    </MantineRadio.Group>
  );
}
