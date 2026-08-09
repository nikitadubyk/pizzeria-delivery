"use client";

import { MantineProvider } from "@mantine/core";
import { useMemo, type ReactNode } from "react";
import {
  createPizzeriaTheme,
  pizzeriaCssVariablesResolver,
  pizzeriaTheme,
  type PizzeriaBrandColor,
} from "./theme";

type AppProviderProps = {
  children: ReactNode;
  primaryColor?: PizzeriaBrandColor;
};

export function AppProvider({ children, primaryColor }: AppProviderProps) {
  const themedConfig = useMemo(() => {
    if (!primaryColor) {
      return {
        cssVariablesResolver: pizzeriaCssVariablesResolver,
        theme: pizzeriaTheme,
      };
    }

    return createPizzeriaTheme(primaryColor);
  }, [primaryColor]);

  return (
    <MantineProvider
      cssVariablesResolver={themedConfig.cssVariablesResolver}
      defaultColorScheme="light"
      theme={themedConfig.theme}
    >
      {children}
    </MantineProvider>
  );
}
