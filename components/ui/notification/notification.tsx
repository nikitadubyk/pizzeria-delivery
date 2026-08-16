"use client";

import { Notifications, notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";

export type AppNotificationInput = {
  title?: string;
  message: string;
};

const iconSize = 20;

const notificationStyles = {
  root: {
    paddingBlock: "var(--mantine-spacing-md)",
    paddingInline: "var(--mantine-spacing-lg)",
  },
  icon: {
    width: 36,
    height: 36,
    minWidth: 36,
  },
  title: {
    marginBottom: "var(--mantine-spacing-xs)",
    fontSize: "var(--mantine-font-size-md)",
    fontWeight: 700,
    lineHeight: 1.35,
  },
  description: {
    lineHeight: 1.45,
  },
};

export const NotificationProvider = () => (
  <Notifications
    autoClose={5000}
    containerWidth={460}
    position="top-right"
    zIndex={1100}
  />
);

export const showSuccessNotification = ({
  title = "Успешно",
  message,
}: AppNotificationInput) =>
  notifications.show({
    title,
    message,
    color: "success",
    icon: <IconCheck size={iconSize} />,
    styles: notificationStyles,
  });

export const showErrorNotification = ({
  title = "Ошибка",
  message,
}: AppNotificationInput) =>
  notifications.show({
    title,
    message,
    color: "failed",
    icon: <IconX size={iconSize} />,
    styles: notificationStyles,
  });
