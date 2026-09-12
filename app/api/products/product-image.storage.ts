import { ApiError, HttpStatus } from "@/app/api/common/api-response";
import { UTApi } from "uploadthing/server";

import type { ProductImageStorage } from "./types";

let uploadThingClient: UTApi | undefined;

const getUploadThingClient = (): UTApi => {
  if (uploadThingClient) return uploadThingClient;

  const token = process.env.UPLOADTHING_TOKEN?.trim();
  if (!token) {
    throw new ApiError(
      "Загрузка изображений не настроена: отсутствует UPLOADTHING_TOKEN",
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  uploadThingClient = new UTApi({ token });
  return uploadThingClient;
};

const deleteProductImages = async (keys: readonly string[]): Promise<void> => {
  if (keys.length === 0) return;

  const result = await getUploadThingClient().deleteFiles([...keys]);
  if (!result.success) {
    throw new Error(
      `UploadThing did not delete ${keys.length} product image file(s)`,
    );
  }
};

export const productImageStorage: ProductImageStorage = {
  delete: async (key) => deleteProductImages([key]),
  deleteMany: deleteProductImages,
};
