"use client";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Button } from "../button";
import {
  NotificationProvider,
  showErrorNotification,
  showSuccessNotification,
} from ".";

const meta = {
  title: "UI/Notification",
  component: NotificationProvider,
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button
        onClick={() =>
          showSuccessNotification({
            title: "Заказ принят",
            message: "Заказ успешно отправлен на кухню.",
          })
        }
      >
        Показать успех
      </Button>
      <Button
        onClick={() =>
          showErrorNotification({
            message: "Не удалось сохранить изменения. Попробуйте ещё раз.",
          })
        }
        variant="secondary"
      >
        Показать ошибку
      </Button>
    </div>
  ),
} satisfies Meta<typeof NotificationProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
