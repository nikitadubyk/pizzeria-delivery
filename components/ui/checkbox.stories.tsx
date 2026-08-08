import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Checkbox, CheckboxGroup } from "./checkbox";

const meta = {
  title: "UI/Checkbox",
  component: Checkbox,
  args: {
    label: "Не звонить, написать в чат",
  },
} satisfies Meta<typeof Checkbox>;

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
    <CheckboxGroup
      label="Добавки"
      defaultValue={["cheese"]}
      options={[
        { value: "cheese", label: "Двойной сыр +79₽" },
        { value: "bacon", label: "Бекон +99₽" },
        { value: "mushrooms", label: "Грибы +69₽" },
      ]}
    />
  ),
};
