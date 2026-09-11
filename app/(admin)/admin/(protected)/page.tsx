"use client";

import { Typography } from "@/components/ui";
import { useRestaurantIdentity } from "../auth-guard";

export default function RestaurantAdminPage() {
  const user = useRestaurantIdentity();

  return (
    <section className="grid gap-sm rounded-2xl border border-border bg-background p-lg">
      <Typography variant="h1">
        Добро пожаловать{user.name ? `, ${user.name}` : ""}!
      </Typography>
      <Typography muted>
        Выберите раздел для управления рестораном. Разделы пока находятся в разработке.
      </Typography>
    </section>
  );
}
