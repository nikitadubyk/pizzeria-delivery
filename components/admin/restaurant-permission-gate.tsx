"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Typography } from "@/components/ui";
import { ROUTES } from "@/config/routes";
import { useRestaurantPermission } from "@/hooks/use-restaurant-permission";
import type { RestaurantPermission } from "@/lib/auth/restaurant-permissions";

type RestaurantPermissionGateProps = {
  permission: RestaurantPermission;
  children: ReactNode;
  fallback?: ReactNode;
};

export function RestaurantPermissionGate({
  permission, children, fallback = null,
}: RestaurantPermissionGateProps) {
  return useRestaurantPermission(permission) ? children : fallback;
}

export function RestaurantPermissionPage({
  permission, children,
}: Omit<RestaurantPermissionGateProps, "fallback">) {
  return (
    <RestaurantPermissionGate
      permission={permission}
      fallback={
        <section className="grid gap-md rounded-2xl border border-border bg-background p-lg">
          <Typography variant="h1">Нет доступа</Typography>
          <Typography muted>У вашей учётной записи нет прав на этот раздел.</Typography>
          <Link className="text-primary underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary" href={ROUTES.ADMIN.ROOT}>
            На главную админки
          </Link>
        </section>
      }
    >
      {children}
    </RestaurantPermissionGate>
  );
}
