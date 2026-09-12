import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";

import {
  ImageDropzone,
  type ImageDropzoneProps,
} from "./image-dropzone";

function ControlledImageDropzone(args: ImageDropzoneProps) {
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="w-full max-w-lg">
      <ImageDropzone {...args} onChange={setFile} value={file} />
    </div>
  );
}

const meta = {
  title: "Components/ImageDropzone",
  component: ImageDropzone,
  args: {
    label: "Фото продукта",
    onChange: () => undefined,
    value: null,
  },
  render: (args) => <ControlledImageDropzone {...args} />,
} satisfies Meta<typeof ImageDropzone>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };

export const WithCurrentImage: Story = {
  args: {
    currentImageUrl: "/window.svg",
  },
};
