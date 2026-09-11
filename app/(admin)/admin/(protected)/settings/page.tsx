import { RestaurantPermissionPage } from "@/components/admin/restaurant-permission-gate";
import { RESTAURANT_PERMISSION as P } from "@/lib/auth/restaurant-permissions";
import { AdminPlaceholder } from "@/components/admin/admin-placeholder";

export default function SettingsPage() {
  return (
    <RestaurantPermissionPage permission={P.SETTINGS_MANAGE}>
      <AdminPlaceholder
        title="Настройки"
        description="Здесь будут настройки ресторана, оформления витрины, доставки, самовывоза и уведомлений."
      />
    </RestaurantPermissionPage>
  );
}

