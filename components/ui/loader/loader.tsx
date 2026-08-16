"use client";

import { LoadingOverlay, type LoadingOverlayProps } from "@mantine/core";

export type AppLoaderProps = Omit<LoadingOverlayProps, "visible"> & {
  visible: boolean;
  fullscreen?: boolean;
};

export const Loader = ({
  visible,
  fullscreen = false,
  loaderProps,
  overlayProps,
  ...props
}: AppLoaderProps) => (
  <LoadingOverlay
    aria-label="Загрузка"
    loaderProps={{ color: "brand", type: "dots", ...loaderProps }}
    overlayProps={{ blur: 2, fixed: fullscreen, ...overlayProps }}
    role="status"
    visible={visible}
    zIndex={1000}
    {...props}
  />
);
