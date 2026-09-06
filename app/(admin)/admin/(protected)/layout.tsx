import type { ReactNode } from "react";
import { RestaurantAuthGuard } from "../auth-guard";

export default function ProtectedRestaurantLayout({ children }: { children: ReactNode }) {
  return <RestaurantAuthGuard>{children}</RestaurantAuthGuard>;
}
