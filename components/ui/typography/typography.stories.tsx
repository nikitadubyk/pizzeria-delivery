import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Typography } from ".";

const meta = {
  title: "UI/Typography",
  component: Typography,
  args: {
    children: "Вкусно Дома",
    variant: "h2",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["display", "h1", "h2", "h3", "h4", "body", "bodySm", "caption", "eyebrow"],
    },
  },
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Scale: Story = {
  render: () => (
    <div className="grid max-w-2xl gap-md">
      <Typography variant="eyebrow">Menu typography</Typography>
      <Typography variant="display">Вкусно Дома</Typography>
      <Typography variant="h1">Горячая пицца за 35 минут</Typography>
      <Typography variant="h2">Популярные блюда</Typography>
      <Typography variant="h3">Пицца Маргарита</Typography>
      <Typography variant="h4">Добавки и размер</Typography>
      <Typography>
        Томатный соус, моцарелла, свежий базилик и тонкое тесто.
      </Typography>
      <Typography muted variant="bodySm">
        Подходит для карточек, подписей и вторичного текста.
      </Typography>
      <Typography variant="caption">349 ₽</Typography>
    </div>
  ),
};
