import type { FileRejection } from "@mantine/dropzone";

import { PRODUCT_IMAGE_MIME_TYPES } from "@/api-contracts";

export const IMAGE_SOURCE_MAX_BYTES = 10 * 1024 * 1024;

export const ACCEPTED_IMAGE_TYPES = [...PRODUCT_IMAGE_MIME_TYPES];

export function getImageRejectionMessage(
  rejections: FileRejection[],
  maxSize: number,
) {
  switch (rejections[0]?.errors[0]?.code) {
    case "file-too-large":
      return `Файл не должен превышать ${Math.round(maxSize / 1024 / 1024)} МБ`;
    case "file-invalid-type":
      return "Поддерживаются изображения JPG, PNG и WebP";
    default:
      return "Не удалось выбрать изображение";
  }
}
