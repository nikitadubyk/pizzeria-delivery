"use client";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { QuantityStepper, type QuantityStepperSize } from ".";

const sizes: QuantityStepperSize[] = ["sm", "md", "lg"];

function ControlledQuantityStepper({
  defaultValue = 1,
  max,
  min,
  size,
  step,
}: {
  defaultValue?: number;
  max?: number;
  min?: number;
  size?: QuantityStepperSize;
  step?: number;
}) {
  const [quantity, setQuantity] = useState(defaultValue);

  return (
    <div className="grid w-max justify-items-start gap-2">
      <QuantityStepper
        max={max}
        min={min}
        onChange={setQuantity}
        size={size}
        step={step}
        value={quantity}
      />
      <span className="text-sm text-muted">Количество: {quantity}</span>
    </div>
  );
}

const meta = {
  title: "UI/QuantityStepper",
  component: QuantityStepper,
  args: {
    max: 10,
    min: 0,
    onChange: () => undefined,
    size: "md",
    step: 1,
    value: 1,
  },
  argTypes: {
    max: {
      control: "number",
    },
    min: {
      control: "number",
    },
    onChange: {
      action: "changed",
    },
    size: {
      control: "select",
      options: sizes,
    },
    step: {
      control: "number",
    },
    value: {
      control: "number",
    },
  },
} satisfies Meta<typeof QuantityStepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {},
};

export const Controlled: Story = {
  args: {},
  render: () => <ControlledQuantityStepper defaultValue={2} max={12} />,
};

export const Sizes: Story = {
  args: {},
  render: () => (
    <div className="flex flex-wrap items-end gap-5">
      {sizes.map((size, index) => (
        <div key={size} className="grid w-max justify-items-start gap-2">
          <QuantityStepper
            max={10}
            min={0}
            onChange={() => undefined}
            size={size}
            value={index + 1}
          />
          <span className="text-sm text-muted">Размер {size}</span>
        </div>
      ))}
    </div>
  ),
};

export const Limits: Story = {
  args: {},
  render: () => (
    <div className="flex flex-wrap items-end gap-5">
      <div className="grid w-max justify-items-start gap-2">
        <QuantityStepper
          max={10}
          min={1}
          onChange={() => undefined}
          value={1}
        />
        <span className="text-sm text-muted">Минимум</span>
      </div>
      <div className="grid w-max justify-items-start gap-2">
        <QuantityStepper
          max={10}
          min={1}
          onChange={() => undefined}
          value={10}
        />
        <span className="text-sm text-muted">Максимум</span>
      </div>
      <div className="grid w-max justify-items-start gap-2">
        <QuantityStepper
          disabled
          max={10}
          min={1}
          onChange={() => undefined}
          value={3}
        />
        <span className="text-sm text-muted">Недоступно</span>
      </div>
    </div>
  ),
};

export const StepByTwo: Story = {
  args: {},
  render: () => (
    <ControlledQuantityStepper defaultValue={2} max={20} min={0} step={2} />
  ),
};
