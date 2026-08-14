import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { AppFooter } from "./";

const meta = {
  title: "Components/AppFooter",
  component: AppFooter,
  args: {
    brandName: "Вкусно Дома",
    developerHref: "https://t.me/",
    developerName: "Команда разработки",
  },
  argTypes: {
    brandName: { control: "text" },
    description: { control: "text" },
    developerHref: { control: "text" },
    developerName: { control: "text" },
  },
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof AppFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

const renderFooter: Story["render"] = (args) => (
  <div className="-m-6">
    <AppFooter {...args} />
  </div>
);

export const Default: Story = { render: renderFooter };

export const SingleSalesPoint: Story = {
  args: {
    brandName: "Тесто & Пламя",
    salesPoints: [
      {
        address: "ул. Пекарская, 7",
        hours: "Ежедневно с 10:00 до 23:00",
        name: "Флагманская пиццерия",
        phone: "+7 800 555-35-35",
      },
    ],
  },
  render: renderFooter,
};

export const Mobile: Story = {
  globals: { viewport: { value: "mobile2", isRotated: false } },
  render: renderFooter,
};
