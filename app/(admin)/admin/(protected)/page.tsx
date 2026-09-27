"use client";

import { Typography } from "@/components/ui";
import { useRestaurantIdentity } from "../auth-guard";

export default function RestaurantAdminPage() {
  const user = useRestaurantIdentity();

  return (
    <section className="gap-sm border-border bg-background p-lg grid rounded-2xl border">
      <Typography variant="h1">
        Добро пожаловать{user.name ? `, ${user.name}` : ""}!
      </Typography>
      <Typography muted>
        Выберите раздел для управления рестораном. Разделы пока находятся в
        разработке.
      </Typography>
    </section>
  );
}
