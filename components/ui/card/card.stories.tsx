import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Card } from ".";

const meta = {
  title: "UI/Card",
  component: Card,
  args: {
    actionLabel: "В корзину",
    description: "Говяжья котлета, сыр, свежие овощи",
    imageLabel: "Фото: Бургер Классический",
    price: "349 ₽",
    title: "Бургер Классический",
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Placeholder: Story = {};

export const WithImage: Story = {
  args: {
    imageAlt: "Пицца Маргарита",
    imageSrc:
      "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&w=900&q=80",
    title: "Пицца Маргарита",
    description: "Томатный соус, моцарелла, базилик",
    imageLabel: undefined,
    price: "579 ₽",
  },
};

export const Grid: Story = {
  render: () => (
    <div className="grid max-w-4xl gap-5 md:grid-cols-3">
      <Card
        actionLabel="В корзину"
        description="Говяжья котлета, сыр, свежие овощи"
        imageLabel="Фото: Бургер Классический"
        price="349 ₽"
        title="Бургер Классический"
      />
      <Card
        actionLabel="В корзину"
        description="Двойной сыр, хрустящий бекон"
        imageLabel="Фото: Чизбургер Делюкс"
        price="399 ₽"
        title="Чизбургер Делюкс"
      />
      <Card
        actionLabel="В корзину"
        description="Халапеньо и острый соус"
        imageLabel="Фото: Бургер Острый"
        price="379 ₽"
        title="Бургер Острый"
      />
    </div>
  ),
};
