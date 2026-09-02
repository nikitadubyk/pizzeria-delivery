import { redirect } from "next/navigation";

import { ROUTES } from "@/config/routes";

const SuperAdminDashboardPage = () =>
  redirect(ROUTES.SUPER_ADMIN.RESTAURANTS);

export default SuperAdminDashboardPage;
