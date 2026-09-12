import { ProductFormPage } from "@/components/admin/product-form-page";
import { RestaurantPermissionPage } from "@/components/admin/restaurant-permission-gate";
import { RESTAURANT_PERMISSION as P } from "@/lib/auth/restaurant-permissions";

export default function CreateProductPage() {
  return (
    <RestaurantPermissionPage permission={P.MENU_MANAGE}>
      <ProductFormPage />
    </RestaurantPermissionPage>
  );
}
