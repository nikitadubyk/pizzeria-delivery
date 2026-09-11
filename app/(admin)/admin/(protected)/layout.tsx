import type { ReactNode } from "react";
import { RestaurantAuthGuard } from "../auth-guard";
import { RestaurantAdminShell } from "@/components/admin/restaurant-admin-shell";

export default function ProtectedRestaurantLayout({ children }: { children: ReactNode }) {
  return (
    <RestaurantAuthGuard>
      <RestaurantAdminShell>{children}</RestaurantAdminShell>
    </RestaurantAuthGuard>
  );
}
