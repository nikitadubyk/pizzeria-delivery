import { PRODUCT_IMAGE_MIME_TYPES } from "@/api-contracts";
import { ApiError, HttpStatus } from "@/app/api/common/api-response";
import { toProductDto } from "@/app/api/products/product.mapper";
import { productService } from "@/app/api/products/product.service";
import { RESTAURANT_PERMISSION } from "@/lib/auth/restaurant-permissions";
import * as yup from "yup";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

import { requireRestaurantPermission } from "../require-permission";

const upload = createUploadthing();
const productImageMimeTypes = new Set<string>(PRODUCT_IMAGE_MIME_TYPES);
const productImageFileConfig = {
  maxFileSize: "4MB",
  maxFileCount: 1,
  minFileCount: 1,
  contentDisposition: "inline",
} as const;
const productImageRouteConfig = {
  [PRODUCT_IMAGE_MIME_TYPES[0]]: productImageFileConfig,
  [PRODUCT_IMAGE_MIME_TYPES[1]]: productImageFileConfig,
  [PRODUCT_IMAGE_MIME_TYPES[2]]: productImageFileConfig,
};

const productImageInputSchema = yup.object({
  productId: yup.string().trim().required("Идентификатор продукта обязателен"),
});

const toUploadThingError = (error: unknown): UploadThingError => {
  if (error instanceof UploadThingError) return error;

  if (error instanceof ApiError) {
    let code: UploadThingError["code"];

    switch (error.status) {
      case HttpStatus.NOT_FOUND:
        code = "NOT_FOUND";
        break;
      case HttpStatus.BAD_REQUEST:
        code = "BAD_REQUEST";
        break;
      case HttpStatus.PAYLOAD_TOO_LARGE:
        code = "TOO_LARGE";
        break;
      case HttpStatus.INTERNAL_SERVER_ERROR:
      case HttpStatus.BAD_GATEWAY:
        code = "INTERNAL_SERVER_ERROR";
        break;
      default:
        code = "FORBIDDEN";
    }

    return new UploadThingError({
      code,
      message: error.message,
      cause: error,
    });
  }

  return new UploadThingError({
    code: "INTERNAL_SERVER_ERROR",
    message: "Не удалось обработать загрузку изображения",
    cause: error,
  });
};

export const uploadRouter = {
  productImage: upload(
    productImageRouteConfig,
    { awaitServerData: true },
  )
    .input(productImageInputSchema)
    .middleware(async ({ req, input, files }) => {
      try {
        if (
          files.length !== 1 ||
          !productImageMimeTypes.has(files[0]?.type ?? "")
        ) {
          throw new UploadThingError({
            code: "BAD_REQUEST",
            message: "Поддерживаются изображения JPG, PNG и WebP",
          });
        }

        const identity = await requireRestaurantPermission(
          req,
          RESTAURANT_PERMISSION.MENU_MANAGE,
        );
        await productService.getById(identity.restaurant.id, input.productId);

        return {
          productId: input.productId,
          restaurantId: identity.restaurant.id,
        };
      } catch (error) {
        throw toUploadThingError(error);
      }
    })
    .onUploadError(({ error, fileKey }) => {
      console.error(`UploadThing failed to upload file ${fileKey}`, error);
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        const product = await productService.attachUploadedImage(
          metadata.restaurantId,
          metadata.productId,
          { key: file.key, url: file.ufsUrl },
        );

        return { product: toProductDto(product) };
      } catch (error) {
        throw toUploadThingError(error);
      }
    }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
