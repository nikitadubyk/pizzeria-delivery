"use client";

import { Switch as MantineSwitch, type SwitchProps } from "@mantine/core";

export function Toggle(props: SwitchProps) {
  return <MantineSwitch size="md" {...props} />;
}
