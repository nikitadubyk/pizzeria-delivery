"use client";

import { Box } from "@mantine/core";
import { IconPhoto } from "@tabler/icons-react";

import type { ProductDto } from "@/api-contracts";

export function ProductImage({ product }: { product: ProductDto }) {
  return (
    <div className="grid size-12 place-items-center overflow-hidden rounded-lg border border-border bg-surface">
      {product.imageUrl ? (
        <Box
          alt=""
          className="size-full object-cover"
          component="img"
          src={product.imageUrl}
        />
      ) : (
        <IconPhoto aria-hidden="true" className="text-muted" size={24} />
      )}
    </div>
  );
}
