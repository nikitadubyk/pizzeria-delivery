import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Details } from "./details";
import { Button, Typography } from "./ui";

const meta = {
  title: "Components/Details",
  component: Details,
  args: {
    children: <Typography>Данные загружены</Typography>,
  },
} satisfies Meta<typeof Details>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Content: Story = {};
export const Loading: Story = { args: { isLoading: true } };
export const Fetching: Story = {
  args: { isFetching: true, children: <Button>Действие с данными</Button> },
};
export const Error: Story = {
  args: { isError: true, errorMessage: "Не удалось загрузить рестораны" },
};

function RetryExample() {
  const [status, setStatus] = useState<"error" | "fetching" | "ready">("error");
  return (
    <Details
      isError={status !== "ready"}
      isFetching={status === "fetching"}
      onRetry={() => {
        setStatus("fetching");
        setTimeout(() => setStatus("ready"), 800);
      }}
    >
      <Typography>Данные загружены после повторной попытки</Typography>
    </Details>
  );
}

export const Retry: Story = { render: () => <RetryExample /> };
