import { RestaurantPermissionPage } from "@/components/admin/restaurant-permission-gate";
import { RESTAURANT_PERMISSION as P } from "@/lib/auth/restaurant-permissions";
import { AdminPlaceholder } from "@/components/admin/admin-placeholder";

export default function EmployeesPage() {
  return (
    <RestaurantPermissionPage permission={P.EMPLOYEES_READ}>
      <AdminPlaceholder
        title="Доступ сотрудников"
        description="Здесь владелец сможет просматривать сотрудников ресторана, восстанавливать им доступ и отключать учётные записи."
      />
    </RestaurantPermissionPage>
  );
}

