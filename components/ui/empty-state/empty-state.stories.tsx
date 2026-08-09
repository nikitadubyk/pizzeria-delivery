import {
  IconClipboardList,
  IconPizza,
  IconSearch,
  IconShoppingCart,
} from "@tabler/icons-react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "../button";
import { EmptyState, type EmptyStateSize } from ".";

const sizes: EmptyStateSize[] = ["sm", "md", "lg"];

const meta = {
  title: "UI/EmptyState",
  component: EmptyState,
  args: {
    description: "Добавьте пиццу из меню, и она появится здесь.",
    icon: <IconShoppingCart size={32} stroke={1.8} />,
    size: "md",
    title: "Корзина пустая",
  },
  argTypes: {
    size: {
      control: "select",
      options: sizes,
    },
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithAction: Story = {
  args: {
    action: <Button size="sm">Перейти в меню</Button>,
  },
};

export const WithImage: Story = {
  args: {
    description: "Попробуйте изменить запрос или выбрать другую категорию.",
    imageAlt: "Пустая тарелка",
    imageSrc:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=240&q=80",
    title: "Ничего не найдено",
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="grid gap-4">
      {sizes.map((size) => (
        <EmptyState
          key={size}
          description="Здесь появятся данные, когда они будут доступны."
          icon={<IconClipboardList size={size === "lg" ? 40 : 28} stroke={1.8} />}
          size={size}
          title={`Пустое состояние ${size}`}
        />
      ))}
    </div>
  ),
};

export const Orders: Story = {
  args: {
    description: "Когда гости оформят заказ, он появится в этом списке.",
    icon: <IconClipboardList size={32} stroke={1.8} />,
    title: "Заказов пока нет",
  },
};

export const Search: Story = {
  args: {
    description: "Проверьте название блюда или сбросьте фильтры.",
    icon: <IconSearch size={32} stroke={1.8} />,
    title: "Ничего не нашли",
  },
};

export const Menu: Story = {
  args: {
    action: <Button size="sm">Добавить блюдо</Button>,
    description: "Создайте первую пиццу, напиток или комбо для этой пиццерии.",
    icon: <IconPizza size={32} stroke={1.8} />,
    title: "Меню пустое",
  },
};
