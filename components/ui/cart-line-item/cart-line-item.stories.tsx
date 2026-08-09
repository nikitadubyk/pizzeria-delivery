"use client";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useMemo, useState } from "react";
import { CartLineItem, type CartLineItemOption } from ".";

function StatefulCartLineItem({
  defaultQuantity = 1,
  maxQuantity = 9,
  minQuantity = 1,
  options,
  pricePerItem,
  title,
}: {
  defaultQuantity?: number;
  maxQuantity?: number;
  minQuantity?: number;
  options?: CartLineItemOption[];
  pricePerItem: number;
  title: string;
}) {
  const [quantity, setQuantity] = useState(defaultQuantity);
  const price = useMemo(
    () => `${pricePerItem * quantity} ₽`,
    [pricePerItem, quantity],
  );

  return (
    <CartLineItem
      price={price}
      title={title}
      options={options}
      quantity={quantity}
      maxQuantity={maxQuantity}
      minQuantity={minQuantity}
      onQuantityChange={setQuantity}
      onRemove={() => undefined}
    />
  );
}

const pizzaOptions: CartLineItemOption[] = [
  { label: "Размер:", value: "30 см" },
  { label: "Тесто:", value: "тонкое" },
  { label: "Добавки:", value: "моцарелла, базилик" },
];

const meta = {
  title: "UI/CartLineItem",
  component: CartLineItem,
  args: {
    onQuantityChange: () => undefined,
    options: pizzaOptions,
    price: "579 ₽",
    quantity: 1,
    title: "Пицца Маргарита",
  },
  argTypes: {
    onQuantityChange: {
      action: "quantity changed",
    },
    onRemove: {
      action: "removed",
    },
  },
} satisfies Meta<typeof CartLineItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {},
};

export const Interactive: Story = {
  args: {},
  render: () => (
    <StatefulCartLineItem
      defaultQuantity={2}
      options={pizzaOptions}
      pricePerItem={579}
      title="Пицца Маргарита"
    />
  ),
};

export const WithoutOptions: Story = {
  args: {
    onRemove: () => undefined,
    options: undefined,
    price: "240 ₽",
    quantity: 1,
    title: "Кола 1 л",
  },
};

export const LongOptions: Story = {
  args: {
    onRemove: () => undefined,
    options: [
      { label: "Размер:", value: "40 см" },
      { label: "Тесто:", value: "сырный борт" },
      {
        label: "Без:",
        value: "лук, острый перец, маслины",
      },
      {
        label: "Добавки:",
        value: "пепперони, грибы, дополнительная моцарелла, соус ранч",
      },
    ],
    price: "1 240 ₽",
    quantity: 3,
    title: "Пицца Пепперони Делюкс",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    onRemove: () => undefined,
    options: pizzaOptions,
    price: "579 ₽",
    quantity: 1,
    title: "Пицца Маргарита",
  },
};

export const CartList: Story = {
  args: {},
  render: () => (
    <div className="grid max-w-3xl gap-3">
      <StatefulCartLineItem
        defaultQuantity={1}
        options={pizzaOptions}
        pricePerItem={579}
        title="Пицца Маргарита"
      />
      <StatefulCartLineItem
        defaultQuantity={2}
        options={[
          { label: "Размер:", value: "35 см" },
          { label: "Тесто:", value: "классическое" },
          { label: "Добавки:", value: "халапеньо" },
        ]}
        pricePerItem={690}
        title="Пицца Диабло"
      />
      <StatefulCartLineItem
        defaultQuantity={1}
        options={[{ label: "Объем:", value: "1 л" }]}
        pricePerItem={240}
        title="Кола"
      />
    </div>
  ),
};
