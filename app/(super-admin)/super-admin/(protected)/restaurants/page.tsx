import { Typography } from "@/components/ui";

import { AdminPageWrapper } from "../admin-page-wrapper";

const SuperAdminRestaurantsPage = () => (
  <AdminPageWrapper>
    <div>
      <Typography muted variant="eyebrow">
        Управление платформой
      </Typography>
      <Typography variant="h1">Рестораны</Typography>
    </div>

    <section className="rounded-2xl border border-border bg-background p-lg shadow-sm sm:p-xl">
      <Typography variant="h3">Пиццерии</Typography>
      <Typography className="mt-xs" muted>
        Здесь будет находиться список ресторанов и управление их состоянием.
      </Typography>
    </section>
  </AdminPageWrapper>
);

export default SuperAdminRestaurantsPage;
