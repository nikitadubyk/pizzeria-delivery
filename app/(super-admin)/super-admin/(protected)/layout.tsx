import type { ReactNode } from "react";

import { AdminShell } from "./admin-shell";
import { SuperAdminAuthGuard } from "./auth-guard";

type ProtectedSuperAdminLayoutProps = {
  children: ReactNode;
};

const ProtectedSuperAdminLayout = ({
  children,
}: ProtectedSuperAdminLayoutProps) => (
  <SuperAdminAuthGuard>
    <AdminShell>{children}</AdminShell>
  </SuperAdminAuthGuard>
);

export default ProtectedSuperAdminLayout;
