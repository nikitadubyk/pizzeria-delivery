import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { PhoneInput, type PhoneInputValue } from ".";

const meta = {
  title: "UI/PhoneInput",
  component: PhoneInput,
  args: {
    description: "Нужен для подтверждения заказа и связи с курьером",
    label: "Телефон",
    placeholder: "+7 999 123-45-67",
  },
} satisfies Meta<typeof PhoneInput>;

export default meta;
type Story = StoryObj<typeof meta>;

function ControlledPhoneInputExample() {
  const [phone, setPhone] = useState<PhoneInputValue>("+79991234567");

  return (
    <div className="grid max-w-md gap-3">
      <PhoneInput
        description="Значение хранится в международном формате"
        label="Телефон клиента"
        onChange={setPhone}
        value={phone}
      />
      <p className="text-sm leading-snug text-muted">
        Текущее значение: {phone ?? "не указано"}
      </p>
    </div>
  );
}

export const Default: Story = {};

export const Controlled: Story = {
  render: () => <ControlledPhoneInputExample />,
};

export const WithError: Story = {
  args: {
    error: "Укажите корректный номер телефона",
  },
};
