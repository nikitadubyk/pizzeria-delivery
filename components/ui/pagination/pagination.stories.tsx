"use client";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Pagination } from ".";

function ControlledPagination({
  initialPage = 1,
  total = 12,
}: {
  initialPage?: number;
  total?: number;
}) {
  const [page, setPage] = useState(initialPage);

  return (
    <div className="grid gap-3">
      <Pagination onChange={setPage} total={total} value={page} withEdges />
      <span className="text-sm text-muted">Текущая страница: {page}</span>
    </div>
  );
}

const meta = {
  title: "UI/Pagination",
  component: Pagination,
  args: {
    onChange: () => undefined,
    total: 12,
    value: 4,
  },
  argTypes: {
    onChange: {
      action: "page changed",
    },
    total: {
      control: { min: 1, type: "number" },
    },
    value: {
      control: { min: 1, type: "number" },
    },
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Controlled: Story = {
  render: () => <ControlledPagination initialPage={3} />,
};

export const ManyPages: Story = {
  args: {
    boundaries: 2,
    siblings: 2,
    total: 48,
    value: 24,
    withEdges: true,
  },
};

export const CompactContainer: Story = {
  decorators: [
    (Story) => (
      <div className="max-w-xs">
        <Story />
      </div>
    ),
  ],
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
