import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Textarea } from ".";

const meta = {
  title: "UI/Textarea",
  component: Textarea,
  args: {
    label: "Комментарий",
    placeholder: "Например: домофон не работает, позвоните за 10 минут",
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithError: Story = {
  args: {
    error: "Комментарий слишком длинный",
  },
};
