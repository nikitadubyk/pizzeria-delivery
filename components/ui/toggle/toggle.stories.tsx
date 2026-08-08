import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Toggle } from ".";

const meta = {
  title: "UI/Toggle",
  component: Toggle,
  args: {
    label: "Показывать только доступные блюда",
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
