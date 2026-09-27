import { Badge } from "@/components/ui";
import { formatKopecks } from "@/lib/price";

import { DetailField } from "./detail-field";
import type { ProductVariantProps } from "./types";

export function ProductVariant({ variant }: ProductVariantProps) {
  return (
    <li className="gap-md border-border bg-surface p-md grid rounded-lg border md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
      <dl className="gap-md m-0 grid sm:grid-cols-2">
        <DetailField label="Название" value={variant.name} />
        <DetailField label="Вес" value={variant.weight} />
      </dl>
      <div className="gap-sm grid justify-items-start md:justify-items-end">
        <div className="gap-xs grid md:text-right">
          <span className="text-muted text-sm">Цена</span>
          <span className="text-text text-lg font-extrabold">
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
