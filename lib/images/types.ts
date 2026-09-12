import type { Options as ImageCompressionOptions } from "browser-image-compression";

export type CompressImageOptions = Pick<
  ImageCompressionOptions,
  "maxSizeMB" | "maxWidthOrHeight" | "onProgress" | "signal"
>;

export type UploadProductImageOptions = {
  file: File;
  productId: string;
  signal?: AbortSignal;
  onCompressionProgress?: (progress: number) => void;
  onUploadProgress?: (progress: number) => void;
};
