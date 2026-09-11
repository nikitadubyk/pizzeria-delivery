"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { IconBuildingStore, IconUsers } from "@tabler/icons-react";
import { AdminShell as SharedAdminShell, type AdminMenuItem } from "@/components/admin/admin-shell";
import { showSuccessNotification } from "@/components/ui/notification";
import { ROUTES } from "@/config/routes";
import { advanceAuthSessionRevision } from "@/store/api/axios";
import { clearAuthSession } from "@/store/auth/auth-storage";
import { useAppDispatch } from "@/store/hooks";
import { clearAuthUser } from "@/store/slices/auth.slice";

const menuItems: AdminMenuItem[] = [
  { href: ROUTES.SUPER_ADMIN.RESTAURANTS, icon: IconBuildingStore, label: "Рестораны" },
  { href: ROUTES.SUPER_ADMIN.USERS, icon: IconUsers, label: "Пользователи" },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = () => {
    advanceAuthSessionRevision();
    clearAuthSession();
    dispatch(clearAuthUser());
    showSuccessNotification({ message: "Вы вышли из панели управления" });
    router.replace(ROUTES.SUPER_ADMIN.LOGIN);
  };

  return (
    <SharedAdminShell
      title="Super Admin"
      subtitle="Pizzeria Delivery"
      navigationLabel="Навигация Super Admin"
      menuItems={menuItems}
      onLogout={handleLogout}
    >
      {children}
    </SharedAdminShell>
  );
}
