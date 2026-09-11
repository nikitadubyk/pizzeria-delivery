import { RestaurantPermissionPage } from "@/components/admin/restaurant-permission-gate";
import { RESTAURANT_PERMISSION as P } from "@/lib/auth/restaurant-permissions";
import { AdminPlaceholder } from "@/components/admin/admin-placeholder";

export default function MenuPage() {
  return (
    <RestaurantPermissionPage permission={P.MENU_READ}>
      <AdminPlaceholder
        title="Меню"
        description="Здесь будет управление категориями, блюдами, размерами пиццы, ингредиентами и стоп-листом."
      />
    </RestaurantPermissionPage>
  );
}

