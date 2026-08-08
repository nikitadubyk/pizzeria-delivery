import {
  IconChefHat,
  IconPizza,
  IconTruckDelivery,
} from "@tabler/icons-react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Tabs } from ".";

const iconSize = 18;

const meta = {
  title: "UI/Tabs",
  component: Tabs,
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ProductSections: Story = {
  args: {
    items: [],
  },
  render: () => (
    <Tabs
      items={[
        {
          value: "menu",
          label: "Меню",
          icon: <IconPizza size={iconSize} />,
          content: "Категории блюд, поиск и быстрые фильтры.",
        },
        {
          value: "kitchen",
          label: "Кухня",
          icon: <IconChefHat size={iconSize} />,
          content: "Заказы, статусы приготовления и очередь смены.",
        },
        {
          value: "delivery",
          label: "Доставка",
          icon: <IconTruckDelivery size={iconSize} />,
          content: "Курьеры, маршруты и контакты клиентов.",
        },
      ]}
    />
  ),
};
