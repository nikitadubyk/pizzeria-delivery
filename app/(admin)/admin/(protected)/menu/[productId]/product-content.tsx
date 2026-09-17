import { IconPhoto } from "@tabler/icons-react";
import Image from "next/image";

import { Badge, Typography } from "@/components/ui";

import { DetailField } from "./detail-field";
import { ProductVariant } from "./product-variant";
import type { ProductContentProps } from "./types";

export function ProductContent({ product }: ProductContentProps) {
  return (
    <div className="grid gap-lg">
      <section
        aria-labelledby="product-information"
        className="grid gap-lg rounded-xl border border-border bg-background p-md md:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] lg:grid-cols-[minmax(16rem,22rem)_minmax(0,1fr)] lg:p-lg"
      >
        <div className="relative grid aspect-square w-full max-w-[20rem] justify-self-center place-items-center overflow-hidden rounded-lg border border-border bg-surface md:max-w-none md:justify-self-start">
          {product.imageUrl ? (
            <Image
              alt={product.name}
              className="object-cover"
              fill
              sizes="(min-width: 1024px) 22rem, (min-width: 768px) 16rem, (min-width: 640px) 20rem, 100vw"
              src={product.imageUrl}
              unoptimized
            />
          ) : (
            <div className="grid justify-items-center gap-xs text-muted">
              <IconPhoto aria-hidden="true" size={40} />
              <span className="text-sm">Фото не добавлено</span>
            </div>
          )}
        </div>
        <div className="grid content-start gap-lg">
          <div className="grid gap-sm">
            <Typography id="product-information" variant="h2">
              О продукте
            </Typography>
            <div className="flex flex-wrap gap-xs">
              <Badge tone={product.isPublished ? "success" : "neutral"}>
                {product.isPublished ? "Опубликован" : "Скрыт"}
              </Badge>
              <Badge tone={product.isAvailable ? "success" : "danger"}>
                {product.isAvailable ? "В продаже" : "Стоп-лист"}
              </Badge>
            </div>
          </div>
          <dl className="m-0 grid gap-md sm:grid-cols-2">
            <DetailField label="Название" value={product.name} />
            <DetailField label="Категория" value={product.category.name} />
            <DetailField label="Описание" value={product.description} />
            <DetailField label="Базовый состав" value={product.baseComposition} />
            <DetailField label="Порядок" value={product.sortOrder} />
          </dl>
        </div>
      </section>

      <section
        aria-labelledby="product-variants"
        className="grid gap-md rounded-xl border border-border bg-background p-md lg:p-lg"
      >
        <Typography id="product-variants" variant="h2">
          Варианты ({product.variants.length})
        </Typography>
        {product.variants.length > 0 ? (
          <ul className="m-0 grid list-none gap-sm p-0">
            {product.variants.map((variant) => (
              <ProductVariant key={variant.id} variant={variant} />
            ))}
          </ul>
        ) : (
          <Typography muted>Варианты не добавлены</Typography>
        )}
      </section>
    </div>
  );
}
