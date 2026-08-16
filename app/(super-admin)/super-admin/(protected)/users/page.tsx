import { Typography } from "@/components/ui";

import { AdminPageWrapper } from "../admin-page-wrapper";

const SuperAdminUsersPage = () => (
  <AdminPageWrapper>
    <div>
      <Typography muted variant="eyebrow">
        Управление доступом
      </Typography>
      <Typography variant="h1">Пользователи</Typography>
    </div>

    <section className="rounded-2xl border border-border bg-background p-lg shadow-sm sm:p-xl">
      <Typography variant="h3">Администраторы платформы</Typography>
      <Typography className="mt-xs" muted>
        Здесь будет находиться управление пользователями и их доступом.
      </Typography>
    </section>
  </AdminPageWrapper>
);

export default SuperAdminUsersPage;
