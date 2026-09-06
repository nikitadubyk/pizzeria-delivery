"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/hooks";
import { Alert } from "@mantine/core";
import { Button, Typography } from "@/components/ui";
import { clearRestaurantToken } from "@/store/auth/restaurant-auth-storage";
import { syncRestaurantSession } from "@/store/auth/restaurant-session";
import { ROUTES } from "@/config/routes";
import { useRestaurantIdentity } from "../auth-guard";

export default function RestaurantAdminPage() {
  const router = useRouter();
  const store = useAppStore();
  const user = useRestaurantIdentity();
  const [logoutError, setLogoutError] = useState<string | null>(null);

  return (
    <main className="mx-auto grid w-full max-w-5xl content-start gap-lg p-md sm:p-xl">
      <header className="flex items-center justify-between gap-md">
        <Typography variant="h1">{user.restaurant.name}</Typography>
        <Button
          variant="ghost"
          onClick={() => {
            try {
              clearRestaurantToken();
              syncRestaurantSession(store);
              router.replace(ROUTES.ADMIN.LOGIN);
            } catch {
              setLogoutError("Не удалось выйти. Попробуйте ещё раз.");
            }
          }}
        >
          Выйти
        </Button>
      </header>
      {logoutError && <Alert color="red" role="alert">{logoutError}</Alert>}
      <section className="grid gap-sm rounded-2xl border border-border bg-background p-lg">
        <Typography variant="h2">
          Добро пожаловать{user.name ? `, ${user.name}` : ""}!
        </Typography>
        <Typography muted>Вы вошли в панель управления своего ресторана.</Typography>
      </section>
    </main>
  );
}
