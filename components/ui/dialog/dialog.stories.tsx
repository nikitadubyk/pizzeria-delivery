"use client";

import {
  IconAlertTriangle,
  IconBike,
  IconCheck,
  IconInfoCircle,
  IconPizza,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "../button";
import { Dialog, type AppDialogTone } from ".";

const iconSize = 18;
const dialogIconSize = 22;

const toneOptions: AppDialogTone[] = [
  "primary",
  "success",
  "info",
  "warning",
  "danger",
  "failed",
  "neutral",
];

const toneLabels: Record<AppDialogTone, string> = {
  danger: "Опасность",
  failed: "Ошибка",
  info: "Информация",
  neutral: "Нейтральный",
  primary: "Основной",
  success: "Успех",
  warning: "Предупреждение",
};

const meta = {
  title: "UI/Dialog",
  component: Dialog,
  args: {
    description:
      "Проверьте адрес доставки и состав заказа перед отправкой на кухню.",
    opened: true,
    title: "Подтвердите заказ на доставку",
    tone: "primary",
  },
  argTypes: {
    tone: {
      control: "select",
      options: toneOptions,
    },
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

function DialogWithTrigger() {
  const [opened, handlers] = useDisclosure(false);

  return (
    <>
      <Button
        leftSection={<IconPizza size={iconSize} />}
        onClick={handlers.open}
      >
        Открыть диалог
      </Button>
      <Dialog
        actions={
          <>
            <Button onClick={handlers.close} variant="secondary">
              Отменить
            </Button>
            <Button leftSection={<IconCheck size={iconSize} />}>
              Оформить заказ
            </Button>
          </>
        }
        description="После подтверждения клиент будет получать обновления статуса заказа."
        icon={<IconBike size={dialogIconSize} />}
        onClose={handlers.close}
        opened={opened}
        title="Оформить этот заказ?"
      />
    </>
  );
}

export const Playground: Story = {
  args: {
    children: (
      <div className="grid gap-2 text-sm leading-snug text-text">
        <div className="flex justify-between gap-3">
          <span className="text-muted">Адрес</span>
          <strong className="text-right">ул. Садовая, 12</strong>
        </div>
        <div className="flex justify-between gap-3">
          <span className="text-muted">Время доставки</span>
          <strong className="text-right">35-45 min</strong>
        </div>
      </div>
    ),
    actions: (
      <>
        <Button variant="ghost">Назад</Button>
        <Button leftSection={<IconBike size={iconSize} />}>
          Отправить заказ
        </Button>
      </>
    ),
    icon: <IconPizza size={dialogIconSize} />,
    onClose: () => undefined,
  },
};

export const WithTrigger: Story = {
  args: {
    onClose: () => undefined,
  },
  render: () => <DialogWithTrigger />,
};

export const Tones: Story = {
  args: {
    onClose: () => undefined,
  },
  render: () => (
    <div className="grid gap-3">
      {toneOptions.map((tone) => (
        <Dialog
          key={tone}
          actions={<Button size="sm">Понятно</Button>}
          description={`Этот диалог использует тон «${toneLabels[tone]}» из токенов темы пиццерии.`}
          icon={
            tone === "warning" || tone === "danger" || tone === "failed" ? (
              <IconAlertTriangle size={dialogIconSize} />
            ) : (
              <IconInfoCircle size={dialogIconSize} />
            )
          }
          onClose={() => undefined}
          opened={tone === "primary"}
          title={`${toneLabels[tone]} диалог`}
          tone={tone}
        />
      ))}
      <p className="m-0 text-sm text-muted">
        Измените свойство opened в controls, чтобы посмотреть другой тон.
      </p>
    </div>
  ),
};
