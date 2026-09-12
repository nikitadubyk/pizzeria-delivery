"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Alert } from "@mantine/core";
import {
  IconCategory,
  IconHome,
  IconPizza,
  IconReceipt,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";
import { AdminShell, type AdminMenuItem } from "@/components/admin/admin-shell";
import { useAppStore } from "@/store/hooks";
import { clearRestaurantToken } from "@/store/auth/restaurant-auth-storage";
import { syncRestaurantSession } from "@/store/auth/restaurant-session";
import {
  hasRestaurantPermission,
  RESTAURANT_PERMISSION as P,
  type RestaurantPermission,
} from "@/lib/auth/restaurant-permissions";
import { ROUTES } from "@/config/routes";
import { useRestaurantIdentity } from "@/app/(admin)/admin/auth-guard";

const menuItems: (AdminMenuItem & { permission: RestaurantPermission })[] = [
  {
    href: ROUTES.ADMIN.ROOT,
    permission: P.ADMIN_ACCESS,
    icon: IconHome,
    label: "Главная",
  },
  {
    href: ROUTES.ADMIN.CATEGORIES,
    permission: P.MENU_READ,
    icon: IconCategory,
    label: "Категории",
  },
  {
    href: ROUTES.ADMIN.MENU,
    permission: P.MENU_READ,
    icon: IconPizza,
    label: "Меню",
  },
  {
    href: ROUTES.ADMIN.ORDERS,
    permission: P.ORDERS_READ,
    icon: IconReceipt,
    label: "Заказы",
  },
  {
    href: ROUTES.ADMIN.SETTINGS,
    permission: P.SETTINGS_MANAGE,
    icon: IconSettings,
    label: "Настройки",
  },
  {
    href: ROUTES.ADMIN.EMPLOYEES,
    permission: P.EMPLOYEES_READ,
    icon: IconUsers,
    label: "Доступ сотрудников",
  },
];

export function RestaurantAdminShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const store = useAppStore();
  const user = useRestaurantIdentity();
  const [logoutError, setLogoutError] = useState<string | null>(null);

  const handleLogout = () => {
    try {
      clearRestaurantToken();
      syncRestaurantSession(store);
      router.replace(ROUTES.ADMIN.LOGIN);
    } catch {
      setLogoutError("Не удалось выйти. Попробуйте ещё раз.");
    }
  };

  return (
    <AdminShell
      title={user.restaurant.name}
      subtitle="Панель ресторана"
      navigationLabel="Разделы админки ресторана"
      menuItems={menuItems.filter((item) =>
        hasRestaurantPermission(user.role, item.permission),
      )}
      onLogout={handleLogout}
    >
      <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-md md:p-xl">
        <div className="mx-auto flex min-h-full w-full max-w-7xl flex-col gap-lg md:h-full md:min-h-0">
          {logoutError && (
            <Alert color="red" role="alert">
              {logoutError}
            </Alert>
          )}
          {children}
        </div>
      </main>
    </AdminShell>
  );
}
