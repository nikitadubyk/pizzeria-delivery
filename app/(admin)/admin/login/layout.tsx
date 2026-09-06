import type { ReactNode } from "react";
import { RestaurantAuthGuard } from "../auth-guard";

export default function RestaurantLoginLayout({ children }: { children: ReactNode }) {
  return <RestaurantAuthGuard guest>{children}</RestaurantAuthGuard>;
}
