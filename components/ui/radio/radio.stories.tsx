import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Radio, RadioGroup } from ".";

const sizeOptions = [
  { value: "small", label: "Маленькая" },
  { value: "medium", label: "Средняя" },
  { value: "large", label: "Большая" },
];

const meta = {
  title: "UI/Radio",
  component: Radio,
  args: {
    label: "Доставка",
  },
} satisfies Meta<typeof Radio>;

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
    label: "Недоступно",
  },
};

export const Group: Story = {
  render: () => (
    <RadioGroup
      label="Размер"
      defaultValue="medium"
      options={sizeOptions}
    />
  ),
};

export const ComfortableGroup: Story = {
  render: () => (
    <RadioGroup
      cardPadding="comfortable"
      label="Размер"
      defaultValue="medium"
      options={sizeOptions}
    />
  ),
};

export const DenseGroup: Story = {
  render: () => (
    <RadioGroup
      cardPadding="dense"
      label="Размер"
      defaultValue="medium"
      options={sizeOptions}
    />
  ),
};
