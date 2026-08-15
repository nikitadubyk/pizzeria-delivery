"use client";

import { useMatches } from "@mantine/core";

type DeviceSize =
  | "smallMobile"
  | "mobile"
  | "tablet"
  | "desktop"
  | "largeDesktop"
  | "extraLargeDesktop";

/**
 * Returns the current device range based on Mantine breakpoints:
 * base–xs, xs–sm, sm–md, md–lg, lg–xl or xl+.
 */
const useDeviceSize = (): DeviceSize =>
  useMatches<DeviceSize>({
    base: "smallMobile",
    xs: "mobile",
    sm: "tablet",
    md: "desktop",
    lg: "largeDesktop",
    xl: "extraLargeDesktop",
  });

export const useIsSmallMobile = (): boolean =>
  useDeviceSize() === "smallMobile";

export const useIsMobile = (): boolean => {
  const size = useDeviceSize();

  return size === "smallMobile" || size === "mobile";
};

export const useIsTablet = (): boolean => useDeviceSize() === "tablet";

export const useIsDesktop = (): boolean => useDeviceSize() === "desktop";

export const useIsLargeDesktop = (): boolean =>
  useDeviceSize() === "largeDesktop";

export const useIsExtraLargeDesktop = (): boolean =>
  useDeviceSize() === "extraLargeDesktop";
