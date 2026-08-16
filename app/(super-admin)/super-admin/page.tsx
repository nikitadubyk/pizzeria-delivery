import { redirect } from "next/navigation";

import { ROUTES } from "@/config/routes";

const SuperAdminPage = () => redirect(ROUTES.SUPER_ADMIN.DASHBOARD);

export default SuperAdminPage;
