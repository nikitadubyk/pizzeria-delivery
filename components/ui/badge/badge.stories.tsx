import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Badge, type AppBadgePadding, type AppBadgeTone } from ".";

const tones: AppBadgeTone[] = [
  "primary",
  "success",
  "info",
  "warning",
  "failed",
  "danger",
  "neutral",
];

const paddings: AppBadgePadding[] = ["compact", "default", "comfortable"];

const toneLabels: Record<AppBadgeTone, string> = {
  danger: "Опасность",
  failed: "Ошибка",
  info: "Информация",
  neutral: "Нейтральный",
  primary: "Основной",
  success: "Успешно",
  warning: "Внимание",
};

const paddingLabels: Record<AppBadgePadding, string> = {
  compact: "Компактный",
  default: "Обычный",
  comfortable: "Свободный",
};

const meta = {
  title: "UI/Badge",
  component: Badge,
  args: {
    children: "Готовится",
    padding: "default",
    size: "md",
    tone: "primary",
    variant: "soft",
  },
  argTypes: {
    padding: {
      control: "select",
      options: paddings,
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
    },
    tone: {
      control: "select",
      options: tones,
    },
    variant: {
      control: "select",
      options: ["soft", "filled", "outline"],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Tones: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      {tones.map((tone) => (
        <Badge key={tone} tone={tone}>
          {toneLabels[tone]}
        </Badge>
      ))}
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="grid gap-3">
      {(["soft", "filled", "outline"] as const).map((variant) => (
        <div key={variant} className="flex flex-wrap gap-3">
          {tones.map((tone) => (
            <Badge key={tone} tone={tone} variant={variant}>
              {toneLabels[tone]}
            </Badge>
          ))}
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      {["xs", "sm", "md", "lg", "xl"].map((size) => (
        <Badge key={size} size={size} tone="success">
          {size.toUpperCase()}
        </Badge>
      ))}
    </div>
  ),
};

export const Padding: Story = {
  render: () => (
    <div className="grid gap-3">
      {paddings.map((padding) => (
        <div key={padding} className="flex flex-wrap items-center gap-3">
          <Badge padding={padding} size="sm" tone="info">
            {paddingLabels[padding]} sm
          </Badge>
          <Badge padding={padding} size="md" tone="warning">
            {paddingLabels[padding]} md
          </Badge>
          <Badge padding={padding} size="lg" tone="failed">
            {paddingLabels[padding]} lg
          </Badge>
        </div>
      ))}
    </div>
  ),
};

export const OrderStatuses: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Badge tone="info">Новый</Badge>
      <Badge tone="success">Оплачен</Badge>
      <Badge tone="warning">Готовится</Badge>
      <Badge tone="primary">В доставке</Badge>
      <Badge tone="success" variant="filled">
        Доставлен
      </Badge>
      <Badge tone="failed">Отменен</Badge>
    </div>
  ),
};
