import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Super Admin | Pizzeria Delivery",
};

type SuperAdminLayoutProps = {
  children: ReactNode;
};

const SuperAdminLayout = ({ children }: SuperAdminLayoutProps) => (
  <div className="flex min-h-screen flex-1 bg-surface text-text">
    {children}
  </div>
);

export default SuperAdminLayout;
