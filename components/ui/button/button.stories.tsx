import {
  IconBike,
  IconChevronRight,
  IconPizza,
  IconShoppingBag,
  IconTrash,
} from "@tabler/icons-react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from ".";

const iconSize = 18;

const meta = {
  title: "UI/Button",
  component: Button,
  args: {
    children: "Заказать",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "ghost", "dark", "danger"],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button
        leftSection={<IconPizza size={iconSize} />}
        rightSection={<IconChevronRight size={iconSize} />}
      >
        Заказать
      </Button>
      <Button leftSection={<IconShoppingBag size={iconSize} />} variant="dark">
        В корзину
      </Button>
      <Button leftSection={<IconBike size={iconSize} />} variant="secondary">
        Самовывоз
      </Button>
      <Button variant="ghost">Назад</Button>
      <Button leftSection={<IconTrash size={iconSize} />} variant="danger">
        Удалить
      </Button>
      <Button disabled>Недоступно</Button>
    </div>
  ),
};
