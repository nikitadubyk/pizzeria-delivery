import { RestaurantPermissionPage } from "@/components/admin/restaurant-permission-gate";
import { RESTAURANT_PERMISSION as P } from "@/lib/auth/restaurant-permissions";
import { AdminPlaceholder } from "@/components/admin/admin-placeholder";

export default function OrdersPage() {
  return (
    <RestaurantPermissionPage permission={P.ORDERS_READ}>
      <AdminPlaceholder
        title="Заказы"
        description="Здесь появятся заказы ресторана, их состав, детали доставки и управление статусами."
      />
    </RestaurantPermissionPage>
  );
}

