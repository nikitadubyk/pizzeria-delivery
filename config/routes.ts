export const ROUTES = {
  ADMIN: {
    ROOT: "/admin",
    LOGIN: "/admin/login",
  },
  SUPER_ADMIN: {
    LOGIN: "/super-admin/login",
    RESTAURANTS: "/super-admin/restaurants",
    ROOT: "/super-admin",
    USERS: "/super-admin/users",
  },
} as const;
