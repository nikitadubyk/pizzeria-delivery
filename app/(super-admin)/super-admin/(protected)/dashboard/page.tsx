import { Typography } from "@/components/ui";

import { AdminPageWrapper } from "../admin-page-wrapper";

const SuperAdminDashboardPage = () => (
  <AdminPageWrapper>
    <div>
      <Typography muted variant="eyebrow">
        Доставка еды
      </Typography>
      <Typography variant="h1">Панель Super Admin</Typography>
    </div>

    <section className="rounded-2xl border border-border bg-background p-lg shadow-sm sm:p-xl">
      <Typography variant="h3">Добро пожаловать</Typography>
      <Typography className="mt-xs" muted>
        Здесь будет находиться управление пиццериями и администраторами
        платформы.
      </Typography>
    </section>
  </AdminPageWrapper>
);

export default SuperAdminDashboardPage;
