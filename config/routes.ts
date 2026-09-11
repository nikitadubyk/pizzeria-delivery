export const ROUTES = {
  ADMIN: {
    ROOT: "/admin",
    LOGIN: "/admin/login",
    CATEGORIES: "/admin/categories",
    MENU: "/admin/menu",
    ORDERS: "/admin/orders",
    SETTINGS: "/admin/settings",
    EMPLOYEES: "/admin/employees",
  },
  SUPER_ADMIN: {
    LOGIN: "/super-admin/login",
    RESTAURANTS: "/super-admin/restaurants",
    ROOT: "/super-admin",
    USERS: "/super-admin/users",
  },
} as const;
