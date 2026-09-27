import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Loader } from ".";

const meta = {
  title: "UI/Loader",
  component: Loader,
  args: {
    visible: true,
  },
  render: (args) => (
    <div className="border-border bg-surface relative h-48 overflow-hidden rounded-xl border p-6">
      <p className="text-text m-0">Содержимое загружается...</p>
      <Loader {...args} fullscreen={false} />
    </div>
  ),
} satisfies Meta<typeof Loader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
