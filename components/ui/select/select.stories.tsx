import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Select } from ".";

const deliveryOptions = [
  { value: "delivery", label: "Доставка курьером" },
  { value: "pickup", label: "Самовывоз" },
  { value: "scheduled", label: "Ко времени" },
];

const meta = {
  title: "UI/Select",
  component: Select,
  args: {
    data: deliveryOptions,
    label: "Способ получения",
    placeholder: "Выберите способ",
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Selected: Story = {
  args: {
    defaultValue: "delivery",
  },
};

export const Searchable: Story = {
  args: {
    data: [
      "Маргарита",
      "Пепперони",
      "Четыре сыра",
      "Бургер Классический",
      "Картофель фри",
      "Лимонад",
    ],
    label: "Блюдо",
    placeholder: "Найти блюдо",
    searchable: true,
  },
};

export const WithDisabledOption: Story = {
  args: {
    data: [
      { value: "small", label: "Маленькая" },
      { value: "medium", label: "Средняя" },
      { value: "large", label: "Большая", disabled: true },
    ],
    defaultValue: "medium",
    description: "Большой размер временно недоступен",
    label: "Размер",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: "delivery",
  },
};
