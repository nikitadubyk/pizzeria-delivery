import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { SearchInput } from "./search-input";

const meta = {
  title: "UI/SearchInput",
  component: SearchInput,
  args: {
    className: "max-w-md",
    placeholder: "Найти запись...",
  },
} satisfies Meta<typeof SearchInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
