import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Loader } from ".";

const meta = {
  title: "UI/Loader",
  component: Loader,
  args: {
    visible: true,
  },
  render: (args) => (
    <div className="relative h-48 overflow-hidden rounded-xl border border-border bg-surface p-6">
      <p className="m-0 text-text">Содержимое загружается...</p>
      <Loader {...args} fullscreen={false} />
    </div>
  ),
} satisfies Meta<typeof Loader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
