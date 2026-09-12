import imageCompression from "browser-image-compression";
import { genUploader } from "uploadthing/client";

import type { UploadRouter } from "@/app/api/admin/uploads/core";
import { getRestaurantToken } from "@/store/auth/restaurant-auth-storage";
import { API_BASE_URL, URL } from "@/store/api/config";

import {
  IMAGE_COMPRESSION_MAX_DIMENSION,
  IMAGE_COMPRESSION_MAX_SIZE_MB,
} from "./config";
import type { CompressImageOptions, UploadProductImageOptions } from "./types";

const { uploadFiles } = genUploader<UploadRouter>({
  url: `${API_BASE_URL}${URL.RESTAURANT_UPLOADS}`,
});

export async function compressImage(
  file: File,
  options: CompressImageOptions = {},
): Promise<File> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Можно загружать только изображения");
  }

  return imageCompression(file, {
    maxSizeMB: IMAGE_COMPRESSION_MAX_SIZE_MB,
    maxWidthOrHeight: IMAGE_COMPRESSION_MAX_DIMENSION,
    useWebWorker: true,
    initialQuality: 0.82,
    preserveExif: false,
    ...options,
  });
}

export async function uploadProductImage({
  file,
  productId,
  signal,
  onCompressionProgress,
  onUploadProgress,
}: UploadProductImageOptions): Promise<void> {
  const token = getRestaurantToken();
  if (!token) throw new Error("Сессия ресторана завершена");

  const compressedFile = await compressImage(file, {
    onProgress: onCompressionProgress,
    signal,
  });
  const [uploadedFile] = await uploadFiles("productImage", {
    files: [compressedFile],
    input: { productId },
    headers: { Authorization: `Bearer ${token}` },
    onUploadProgress: ({ progress }) => onUploadProgress?.(progress),
    signal,
  });
  const product = uploadedFile?.serverData.product;

  if (!product?.imageUrl) {
    throw new Error("Сервер не вернул ссылку на загруженное изображение");
  }
}
