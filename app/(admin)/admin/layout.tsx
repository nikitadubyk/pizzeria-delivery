import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Админка ресторана | Pizzeria Delivery",
  robots: { index: false, follow: false },
};

export default function RestaurantAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <div className="bg-surface text-text min-h-dvh">{children}</div>;
}
