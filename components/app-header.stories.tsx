import { IconChefHat, IconClockHour4 } from "@tabler/icons-react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AppHeader, type HeaderNavItem } from "./app-header";

const iconSize = 24;

const extendedNavItems: HeaderNavItem[] = [
  {
    href: "/menu",
    icon: <IconChefHat size={iconSize} />,
    label: "Меню",
  },
  {
    href: "/lunch",
    icon: <IconClockHour4 size={iconSize} />,
    label: "Обеды",
  },
  {
    href: "/events",
    icon: <IconChefHat size={iconSize} />,
    label: "Банкеты",
  },
];

const meta = {
  title: "Components/AppHeader",
  component: AppHeader,
  args: {
    cartItemsCount: 0,
    pizzeriaName: "Пицца Доставка",
  },
  argTypes: {
    cartItemsCount: {
      control: {
        min: 0,
        type: "number",
      },
    },
    navItems: {
      control: false,
    },
    pizzeriaName: {
      control: "text",
    },
  },
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof AppHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithCartItems: Story = {
  args: {
    cartItemsCount: 3,
  },
};

export const CustomNavigation: Story = {
  args: {
    cartItemsCount: 1,
    navItems: extendedNavItems,
    pizzeriaName: "Nonna Pizza",
  },
};
