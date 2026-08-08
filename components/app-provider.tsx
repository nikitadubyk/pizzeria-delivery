"use client";

import { MantineProvider } from "@mantine/core";
import type { ReactNode } from "react";
import { pizzeriaCssVariablesResolver, pizzeriaTheme } from "./theme";

type AppProviderProps = {
  children: ReactNode;
};

export function AppProvider({ children }: AppProviderProps) {
  return (
    <MantineProvider
      cssVariablesResolver={pizzeriaCssVariablesResolver}
      defaultColorScheme="light"
      theme={pizzeriaTheme}
    >
      {children}
    </MantineProvider>
  );
}
