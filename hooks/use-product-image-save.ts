"use client";

import { useState } from "react";

import { uploadProductImage } from "@/lib/images/image-upload";
import {
  PRODUCT_TAG,
  productsApi,
  useRemoveProductImageMutation,
} from "@/store/api/products.api";
import { useAppDispatch } from "@/store/hooks";

type SaveProductImageOptions = {
  currentImageUrl?: string | null;
  image: File | null;
  productId: string;
  removeImage: boolean;
};

export function useProductImageSave() {
  const dispatch = useAppDispatch();
  const [removeProductImage, { isLoading: isRemovingImage }] =
    useRemoveProductImageMutation();
  const [uploadStage, setUploadStage] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const saveProductImage = async ({
    currentImageUrl,
    image,
    productId,
    removeImage,
  }: SaveProductImageOptions) => {
    try {
      if (image) {
        setUploadProgress(0);
        setUploadStage("Сжатие изображения");
        await uploadProductImage({
          file: image,
          productId,
          onCompressionProgress: (progress) => {
            setUploadStage("Сжатие изображения");
            setUploadProgress(progress);
          },
          onUploadProgress: (progress) => {
            setUploadStage("Загрузка изображения");
            setUploadProgress(progress);
          },
        });
        dispatch(productsApi.util.invalidateTags([PRODUCT_TAG]));
      } else if (currentImageUrl && removeImage) {
        await removeProductImage({ productId }).unwrap();
      }
    } finally {
      setUploadStage(null);
      setUploadProgress(0);
    }
  };

  return {
    isSavingImage: isRemovingImage || uploadStage !== null,
    saveProductImage,
    uploadProgress,
    uploadStage,
  };
}
