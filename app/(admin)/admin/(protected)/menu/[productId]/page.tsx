import { RestaurantPermissionPage } from "@/components/admin/restaurant-permission-gate";
import { RESTAURANT_PERMISSION as P } from "@/lib/auth/restaurant-permissions";

import { ProductDetailsPage } from "./product-details-page";
import type { ProductPageProps } from "./types";

export default async function ProductPage({ params }: ProductPageProps) {
  const { productId } = await params;

  return (
    <RestaurantPermissionPage permission={P.MENU_READ}>
      <ProductDetailsPage productId={productId} />
    </RestaurantPermissionPage>
  );
}
