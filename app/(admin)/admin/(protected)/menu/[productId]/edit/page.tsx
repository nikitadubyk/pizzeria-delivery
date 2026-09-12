import { ProductFormPage } from "@/components/admin/product-form-page";
import { RestaurantPermissionPage } from "@/components/admin/restaurant-permission-gate";
import { RESTAURANT_PERMISSION as P } from "@/lib/auth/restaurant-permissions";

type EditProductPageProps = {
  params: Promise<{ productId: string }>;
};

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { productId } = await params;

  return (
    <RestaurantPermissionPage permission={P.MENU_MANAGE}>
      <ProductFormPage productId={productId} />
    </RestaurantPermissionPage>
  );
}
