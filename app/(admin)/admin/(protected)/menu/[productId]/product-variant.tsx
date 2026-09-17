import { Badge } from "@/components/ui";
import { formatKopecks } from "@/lib/price";

import { DetailField } from "./detail-field";
import type { ProductVariantProps } from "./types";

export function ProductVariant({ variant }: ProductVariantProps) {
  return (
    <li className="grid gap-md rounded-lg border border-border bg-surface p-md md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
      <dl className="m-0 grid gap-md sm:grid-cols-2">
        <DetailField label="Название" value={variant.name} />
        <DetailField label="Вес" value={variant.weight} />
      </dl>
      <div className="grid justify-items-start gap-sm md:justify-items-end">
        <div className="grid gap-xs md:text-right">
          <span className="text-sm text-muted">Цена</span>
          <span className="text-lg font-extrabold text-text">
            {formatKopecks(variant.price)}
          </span>
        </div>
        <Badge tone={variant.isAvailable ? "success" : "danger"}>
          {variant.isAvailable ? "Доступен" : "Недоступен"}
        </Badge>
      </div>
    </li>
  );
}
