import type { RestaurantUserRole } from "@/api-contracts";

export const RESTAURANT_PERMISSION = {
  ADMIN_ACCESS: "admin:access",
  MENU_READ: "menu:read",
  MENU_MANAGE: "menu:manage",
  STOP_LIST_MANAGE: "stop-list:manage",
  ORDERS_READ: "orders:read",
  ORDERS_MANAGE: "orders:manage",
  SETTINGS_MANAGE: "settings:manage",
  EMPLOYEES_READ: "employees:read",
  EMPLOYEES_DISABLE: "employees:disable",
  EMPLOYEES_RECOVER: "employees:recover",
} as const;

export type RestaurantPermission =
  typeof RESTAURANT_PERMISSION[keyof typeof RESTAURANT_PERMISSION];

const P = RESTAURANT_PERMISSION;

// New permissions require an explicit role assignment; no wildcard access.
const permissionsByRole: Record<RestaurantUserRole, readonly RestaurantPermission[]> = {
  OWNER: [
    P.ADMIN_ACCESS, P.MENU_READ, P.MENU_MANAGE, P.STOP_LIST_MANAGE,
    P.ORDERS_READ, P.ORDERS_MANAGE, P.SETTINGS_MANAGE,
    P.EMPLOYEES_READ, P.EMPLOYEES_DISABLE, P.EMPLOYEES_RECOVER,
  ],
  EMPLOYEE: [
    P.ADMIN_ACCESS, P.MENU_READ, P.STOP_LIST_MANAGE,
    P.ORDERS_READ, P.ORDERS_MANAGE,
  ],
};

export function hasRestaurantPermission(
  role: string,
  permission: RestaurantPermission,
): boolean {
  if (role !== "OWNER" && role !== "EMPLOYEE") return false;
  return permissionsByRole[role].includes(permission);
}
