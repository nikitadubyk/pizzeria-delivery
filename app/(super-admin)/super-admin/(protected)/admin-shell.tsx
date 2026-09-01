"use client";

import {
  IconBuildingStore,
  IconLayoutDashboard,
  IconLogout,
  IconMenu2,
  IconPizza,
  IconUsers,
  IconX,
  type Icon,
} from "@tabler/icons-react";
import { Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";

import { Button, Typography } from "@/components/ui";
import { showSuccessNotification } from "@/components/ui/notification";
import { ROUTES } from "@/config/routes";
import { cn } from "@/lib/class-names";
import { advanceAuthSessionRevision } from "@/store/api/axios";
import { clearAuthSession } from "@/store/auth/auth-storage";
import { useAppDispatch } from "@/store/hooks";
import { clearAuthUser } from "@/store/slices/auth.slice";

type AdminShellProps = {
  children: ReactNode;
};

type MenuItem = {
  href: string;
  icon: Icon;
  label: string;
};

type AdminNavigationProps = {
  onNavigate?: () => void;
  pathname: string;
};

const menuItems: MenuItem[] = [
  {
    href: ROUTES.SUPER_ADMIN.DASHBOARD,
    icon: IconLayoutDashboard,
    label: "Главная",
  },
  {
    href: ROUTES.SUPER_ADMIN.RESTAURANTS,
    icon: IconBuildingStore,
    label: "Рестораны",
  },
  {
    href: ROUTES.SUPER_ADMIN.USERS,
    icon: IconUsers,
    label: "Пользователи",
  },
];

const AdminBrand = () => (
  <div className="flex items-center gap-sm">
    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-contrast">
      <IconPizza aria-hidden="true" size={24} />
    </span>
    <div className="min-w-0">
      <Typography className="!text-white" variant="h4">
        Super Admin
      </Typography>
      <Typography className="!text-dough-2" variant="caption">
        Pizzeria Delivery
      </Typography>
    </div>
  </div>
);

const AdminNavigation = ({ onNavigate, pathname }: AdminNavigationProps) => (
  <nav aria-label="Навигация Super Admin">
    <ul className="m-0 grid list-none gap-xs p-0">
      {menuItems.map(({ href, icon: MenuIcon, label }) => {
        const active = pathname === href;

        return (
          <li key={href}>
            <Link
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-h-11 items-center gap-sm rounded-xl px-md py-sm text-sm font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                active
                  ? "bg-primary text-primary-contrast"
                  : "text-dough-1 hover:bg-white/10 hover:text-white",
              )}
              href={href}
              onClick={onNavigate}
            >
              <MenuIcon aria-hidden="true" size={20} />
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  </nav>
);

export const AdminShell = ({ children }: AdminShellProps) => {
  const dispatch = useAppDispatch();
  const [menuOpened, menuHandlers] = useDisclosure(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    advanceAuthSessionRevision();
    clearAuthSession();
    dispatch(clearAuthUser());
    showSuccessNotification({ message: "Вы вышли из панели управления" });
    router.replace(ROUTES.SUPER_ADMIN.LOGIN);
  };

  return (
    <div className="grid h-full min-h-screen w-full overflow-hidden md:grid-cols-[260px_minmax(0,1fr)]">
      <Drawer
        onClose={menuHandlers.close}
        opened={menuOpened}
        overlayProps={{ backgroundOpacity: 0.55, blur: 2 }}
        position="left"
        size="min(86vw, 320px)"
        styles={{
          body: {
            background: "var(--app-color-secondary-active)",
            flex: "1 1 0",
            padding: 0,
          },
          content: {
            background: "var(--app-color-secondary-active)",
            display: "flex",
            flexDirection: "column",
            height: "100%",
          },
        }}
        withCloseButton={false}
      >
        <div className="flex min-h-full flex-col p-lg text-white">
          <div className="mb-xl flex items-center justify-between gap-md border-b border-white/10 pb-lg">
            <AdminBrand />
            <button
              aria-label="Закрыть меню"
              className="grid size-10 shrink-0 place-items-center rounded-xl text-dough-1 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              onClick={menuHandlers.close}
              type="button"
            >
              <IconX aria-hidden="true" size={22} />
            </button>
          </div>

          <AdminNavigation
            onNavigate={menuHandlers.close}
            pathname={pathname}
          />
        </div>
      </Drawer>

      <aside className="hidden min-h-0 overflow-y-auto border-r border-border bg-secondary-active p-lg text-white md:block">
        <div className="mb-xl">
          <AdminBrand />
        </div>
        <AdminNavigation pathname={pathname} />
      </aside>

      <div className="flex min-h-0 min-w-0 flex-col">
        <header className="sticky top-0 z-20 flex min-h-16 shrink-0 items-center gap-xs border-b border-border bg-background px-md shadow-sm sm:px-lg">
          <button
            aria-label="Открыть меню"
            className="mr-xs grid size-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary transition-colors hover:bg-primary hover:text-primary-contrast focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:hidden"
            onClick={menuHandlers.toggle}
            type="button"
          >
            <IconMenu2 aria-hidden="true" size={23} stroke={2.25} />
          </button>
          <Button
            leftSection={<IconLogout aria-hidden="true" size={18} />}
            onClick={handleLogout}
            size="sm"
            variant="ghost"
          >
            Выйти
          </Button>
        </header>

        <div className="min-h-0 min-w-0 flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};
