import { Suspense } from "react";

import { ProductList } from "./product-list";

export default function MenuPage() {
  return (
    <Suspense
      fallback={
        <div
          aria-label="Загрузка списка продуктов"
          className="h-full min-h-0"
          role="status"
        />
      }
    >
      <ProductList />
    </Suspense>
  );
}
