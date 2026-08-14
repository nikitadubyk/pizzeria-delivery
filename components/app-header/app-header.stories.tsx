import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AppHeader } from "./";

const meta = {
  title: "Components/AppHeader",
  component: AppHeader,
  args: {
    cartItemsCount: 0,
    pizzeriaName: "Pizza Delivery",
  },
  argTypes: {
    cartItemsCount: {
      control: {
        min: 0,
        type: "number",
      },
    },
    logoImageSrc: {
      control: "text",
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

export const Mobile: Story = {
  args: {
    cartItemsCount: 3,
  },
  globals: {
    viewport: { value: "mobile2", isRotated: false },
  },
};

export const WithImageLogo: Story = {
  args: {
    logoImageAlt: "Логотип Nonna Pizza",
    logoImageSrc: "https://placehold.co/96x96/ff6900/ffffff?text=NP",
    pizzeriaName: "Nonna Pizza",
  },
};

export const BrandedHeader: Story = {
  args: {
    cartItemsCount: 1,
    pizzeriaName: "Nonna Pizza",
  },
};
