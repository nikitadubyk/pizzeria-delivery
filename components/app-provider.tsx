"use client";

import { MantineProvider } from "@mantine/core";
import { StoreProvider } from "@/store/store-provider";
import { useMemo, type ReactNode } from "react";
import { AppLoader } from "./app-loader";
import { NotificationProvider } from "./ui/notification";
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
    <StoreProvider>
      <MantineProvider
        cssVariablesResolver={themedConfig.cssVariablesResolver}
        defaultColorScheme="light"
        theme={themedConfig.theme}
      >
        <NotificationProvider />
        <AppLoader />
        {children}
      </MantineProvider>
    </StoreProvider>
  );
}
