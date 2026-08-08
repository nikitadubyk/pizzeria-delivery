import {
  IconMapPin,
  IconPhone,
  IconSearch,
  IconUser,
} from "@tabler/icons-react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Input } from ".";

const iconSize = 18;

const meta = {
  title: "UI/Input",
  component: Input,
  args: {
    label: "Имя",
    placeholder: "Иван Иванов",
    leftSection: <IconUser size={iconSize} />,
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Search: Story = {
  args: {
    label: undefined,
    leftSection: <IconSearch size={iconSize} />,
    placeholder: "Найти блюдо...",
  },
};

export const WithError: Story = {
  args: {
    error: "Укажите адрес доставки",
    label: "Адрес доставки",
    leftSection: <IconMapPin size={iconSize} />,
    placeholder: "Улица, дом, квартира",
  },
};

export const Examples: Story = {
  render: () => (
    <div className="grid w-full gap-4">
      <Input
        label="Имя"
        leftSection={<IconUser size={iconSize} />}
        placeholder="Иван Иванов"
      />
      <Input
        label="Телефон"
        leftSection={<IconPhone size={iconSize} />}
        placeholder="+7 (___) ___-__-__"
      />
      <Input
        error="Укажите адрес доставки"
        label="Адрес доставки"
        leftSection={<IconMapPin size={iconSize} />}
        placeholder="Улица, дом, квартира"
      />
    </div>
  ),
};
