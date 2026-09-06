export const RESTAURANT_SESSION = {
  seconds: 60 * 60 * 12,
  issuer: "pizzeria-delivery",
  audience: "restaurant-admin",
  type: "restaurant-session",
} as const;
