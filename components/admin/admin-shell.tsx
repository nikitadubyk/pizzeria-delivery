"use client";

import {
  IconLogout,
  IconMenu2,
  IconPizza,
  IconX,
  type Icon,
} from "@tabler/icons-react";
import { Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { Button, Typography } from "@/components/ui";
import { cn } from "@/lib/class-names";

type AdminShellProps = {
  title: string;
  subtitle: string;
  navigationLabel: string;
  menuItems: readonly AdminMenuItem[];
  onLogout: () => void;
  children: ReactNode;
};

export type AdminMenuItem = {
  href: string;
  icon: Icon;
  label: string;
};

type AdminNavigationProps = {
  menuItems: readonly AdminMenuItem[];
  navigationLabel: string;
  onNavigate?: () => void;
  pathname: string;
};

const AdminBrand = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => (
  <div className="gap-sm flex min-w-0 items-center">
    <span className="bg-primary text-primary-contrast grid size-10 shrink-0 place-items-center rounded-xl">
      <IconPizza aria-hidden="true" size={24} />
    </span>
    <div className="min-w-0">
      <Typography as="p" className="break-words !text-white" variant="h4">
        {title}
      </Typography>
      <Typography className="!text-dough-2" variant="caption">
        {subtitle}
      </Typography>
    </div>
  </div>
);

const AdminNavigation = ({
  onNavigate,
  pathname,
  menuItems,
  navigationLabel,
}: AdminNavigationProps) => (
  <nav aria-label={navigationLabel}>
    <ul className="gap-xs m-0 grid list-none p-0">
      {menuItems.map(({ href, icon: MenuIcon, label }) => {
        const active = pathname === href;

        return (
          <li key={href}>
            <Link
              aria-current={active ? "page" : undefined}
              className={cn(
                "gap-sm px-md py-sm focus-visible:outline-primary flex min-h-11 items-center rounded-xl text-sm font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
                active
                  ? "bg-primary text-primary-contrast"
                  : "text-dough-1 hover:bg-white/10 hover:text-white"
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

export const AdminShell = ({
  children,
  title,
  subtitle,
  menuItems,
  navigationLabel,
  onLogout,
}: AdminShellProps) => {
  const [menuOpened, menuHandlers] = useDisclosure(false);
  const pathname = usePathname();

  return (
    <div className="grid h-dvh min-h-0 w-full overflow-hidden xl:grid-cols-[260px_minmax(0,1fr)]">
      <Drawer
        aria-label={navigationLabel}
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
        <div className="p-lg flex min-h-full flex-col text-white">
          <div className="mb-xl gap-md pb-lg flex items-center justify-between border-b border-white/10">
            <AdminBrand title={title} subtitle={subtitle} />
            <button
              aria-label="Закрыть меню"
              className="text-dough-1 focus-visible:outline-primary grid size-10 shrink-0 place-items-center rounded-xl transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              onClick={menuHandlers.close}
              type="button"
            >
              <IconX aria-hidden="true" size={22} />
            </button>
          </div>

          <AdminNavigation
            menuItems={menuItems}
            navigationLabel={navigationLabel}
            onNavigate={menuHandlers.close}
            pathname={pathname}
          />
        </div>
      </Drawer>

      <aside className="border-border bg-secondary-active p-lg hidden min-h-0 overflow-y-auto border-r text-white xl:block">
        <div className="mb-xl">
          <AdminBrand title={title} subtitle={subtitle} />
        </div>
        <AdminNavigation
          menuItems={menuItems}
          navigationLabel={navigationLabel}
          pathname={pathname}
        />
      </aside>

      <div className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden">
        <header className="gap-xs border-border bg-background px-md sm:px-lg sticky top-0 z-20 flex min-h-16 shrink-0 items-center justify-between border-b shadow-sm xl:justify-end">
          <button
            aria-label="Открыть меню"
            className="mr-xs bg-primary-soft text-primary hover:bg-primary hover:text-primary-contrast focus-visible:outline-primary grid size-10 shrink-0 place-items-center rounded-xl transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 xl:hidden"
            onClick={menuHandlers.toggle}
            type="button"
          >
            <IconMenu2 aria-hidden="true" size={23} stroke={2.25} />
          </button>
          <Button
            leftSection={<IconLogout aria-hidden="true" size={18} />}
            onClick={onLogout}
            size="sm"
            variant="ghost"
          >
            Выйти
          </Button>
        </header>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
};
