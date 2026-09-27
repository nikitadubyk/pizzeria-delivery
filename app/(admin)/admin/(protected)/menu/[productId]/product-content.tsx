import { IconPhoto } from "@tabler/icons-react";
import Image from "next/image";

import { Badge, Typography } from "@/components/ui";
import { formatKopecks } from "@/lib/price";

import { DetailField } from "./detail-field";
import { ProductVariant } from "./product-variant";
import type { ProductContentProps } from "./types";

export function ProductContent({ product }: ProductContentProps) {
  return (
    <div className="gap-lg grid">
      <section
        aria-labelledby="product-information"
        className="gap-lg border-border bg-background p-md lg:p-lg grid rounded-xl border md:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] lg:grid-cols-[minmax(16rem,22rem)_minmax(0,1fr)]"
      >
        <div className="border-border bg-surface relative grid aspect-square w-full max-w-[20rem] place-items-center justify-self-center overflow-hidden rounded-lg border md:max-w-none md:justify-self-start">
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
            <div className="gap-xs text-muted grid justify-items-center">
              <IconPhoto aria-hidden="true" size={40} />
              <span className="text-sm">Фото не добавлено</span>
            </div>
          )}
        </div>
        <div className="gap-lg grid content-start">
          <div className="gap-sm grid">
            <Typography id="product-information" variant="h2">
              О продукте
            </Typography>
            <div className="gap-xs flex flex-wrap">
              <Badge tone={product.isPublished ? "success" : "neutral"}>
                {product.isPublished ? "Опубликован" : "Скрыт"}
              </Badge>
              <Badge tone={product.isAvailable ? "success" : "danger"}>
                {product.isAvailable ? "В продаже" : "Стоп-лист"}
              </Badge>
            </div>
          </div>
          <dl className="gap-md m-0 grid sm:grid-cols-2">
            <DetailField label="Название" value={product.name} />
            <DetailField label="Категория" value={product.category.name} />
            <DetailField label="Описание" value={product.description} />
            <DetailField
              label="Базовый состав"
              value={product.baseComposition}
            />
            <DetailField label="Порядок" value={product.sortOrder} />
          </dl>
        </div>
      </section>

      <section
        aria-labelledby="product-addons"
        className="gap-md border-border bg-background p-md lg:p-lg grid rounded-xl border"
      >
        <Typography id="product-addons" variant="h2">
          Добавки ({product.addons.length})
        </Typography>
        {product.addons.length > 0 ? (
          <ul className="gap-sm m-0 grid list-none p-0">
            {product.addons.map(({ id, addon }) => (
              <li
                className="gap-sm border-border bg-surface p-md flex flex-wrap items-center justify-between rounded-lg border"
                key={id}
              >
                <div className="gap-xs grid">
                  <span className="text-text text-sm font-semibold">
                    {addon.name}
                  </span>
                  <span className="text-text text-lg font-extrabold">
                    {formatKopecks(addon.price)}
                  </span>
                </div>
                <Badge tone={addon.isAvailable ? "success" : "danger"}>
                  {addon.isAvailable ? "Доступна" : "Недоступна"}
                </Badge>
              </li>
            ))}
          </ul>
        ) : (
          <Typography muted>Добавки не выбраны</Typography>
        )}
      </section>

      <section
        aria-labelledby="product-variants"
        className="gap-md border-border bg-background p-md lg:p-lg grid rounded-xl border"
      >
        <Typography id="product-variants" variant="h2">
          Варианты ({product.variants.length})
        </Typography>
        {product.variants.length > 0 ? (
          <ul className="gap-sm m-0 grid list-none p-0">
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
