"use client";

import { Burger, Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconGift,
  IconInfoCircle,
  IconMapPin,
  IconMenu2,
  IconPizza,
  IconTruckDelivery,
  IconUserCircle,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { cn, interactiveMotionTransitionClassName } from "@/lib/class-names";

export type HeaderNavItem = {
  href: string;
  icon: ReactNode;
  label: string;
};

export type AppHeaderProps = {
  cartItemsCount?: number;
  navItems?: HeaderNavItem[];
  pizzeriaName?: string;
  profileHref?: string;
};

const iconSize = 24;

export const defaultHeaderNavItems: HeaderNavItem[] = [
  {
    href: "/menu",
    icon: <IconMenu2 size={iconSize} />,
    label: "Меню",
  },
  {
    href: "/about",
    icon: <IconInfoCircle size={iconSize} />,
    label: "О нас",
  },
  {
    href: "/promotions",
    icon: <IconGift size={iconSize} />,
    label: "Акции",
  },
  {
    href: "/delivery",
    icon: <IconTruckDelivery size={iconSize} />,
    label: "Доставка",
  },
  {
    href: "/contacts",
    icon: <IconMapPin size={iconSize} />,
    label: "Контакты",
  },
];

export function AppHeader({
  cartItemsCount = 0,
  navItems = defaultHeaderNavItems,
  pizzeriaName = "Пицца Доставка",
  profileHref = "/profile",
}: AppHeaderProps) {
  const pathname = usePathname() ?? "/";
  const [menuOpened, menuHandlers] = useDisclosure(false);

  const getIsActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <Drawer
        classNames={{
          body: "px-5 pb-6 pt-2",
          close:
            "text-muted hover:bg-primary-soft hover:text-primary-active focus-visible:outline-primary-active",
          content: "bg-background text-text",
          header: "border-b border-border bg-background px-5 py-4",
          title: "font-extrabold text-text",
        }}
        onClose={menuHandlers.close}
        opened={menuOpened}
        position="left"
        size="min(86vw, 340px)"
        title="Меню"
      >
        <nav aria-label="Мобильные разделы сайта" className="grid gap-1">
          {navItems.map((item) => {
            const isActive = getIsActive(item.href);

            return (
              <Link
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex min-h-12 items-center gap-3 rounded-md px-2 text-base font-extrabold text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-active hover:text-primary-active",
                  isActive && "text-primary-active",
                  interactiveMotionTransitionClassName,
                )}
                href={item.href}
                key={item.href}
                onClick={menuHandlers.close}
              >
                <span aria-hidden="true" className="shrink-0">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-5 border-t border-border pt-4">
          <Link
            className={cn(
              "flex min-h-12 items-center gap-3 rounded-md px-2 text-base font-extrabold text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-active hover:text-primary-active",
              getIsActive(profileHref) && "text-primary-active",
              interactiveMotionTransitionClassName,
            )}
            href={profileHref}
            onClick={menuHandlers.close}
          >
            <IconUserCircle aria-hidden="true" size={iconSize} />
            <span>Профиль</span>
          </Link>
        </div>
      </Drawer>

      <header className="sticky top-0 z-30 border-b border-border bg-background/95 text-text shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/85">
        <div className="mx-auto flex min-h-20 w-full max-w-6xl items-center gap-3 px-5 py-3">
          <Burger
            aria-label={menuOpened ? "Закрыть меню" : "Открыть меню"}
            className="shrink-0 md:hidden"
            color="var(--app-color-text)"
            onClick={menuHandlers.toggle}
            opened={menuOpened}
            size="sm"
          />

          <Link
            className={cn(
              "flex min-w-0 shrink-0 items-center gap-3 rounded-full pr-2 focus-visible:outline focus-visible:outline-offset-4 focus-visible:outline-primary-active",
              interactiveMotionTransitionClassName,
            )}
            href="/"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-contrast shadow-sm">
              <IconPizza aria-hidden="true" size={28} stroke={2.4} />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-lg font-extrabold leading-snug text-text">
                {pizzeriaName}
              </span>
              <span className="block truncate text-xs font-bold leading-tight text-muted">
                Горячая пицца рядом
              </span>
            </span>
          </Link>

          <nav
            aria-label="Разделы сайта"
            className="hidden min-w-0 flex-1 justify-center gap-2 overflow-x-auto py-1 [-ms-overflow-style:none] [scrollbar-width:none] md:flex [&::-webkit-scrollbar]:hidden"
          >
            {navItems.map((item) => {
              const isActive = getIsActive(item.href);

              return (
                <Link
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "inline-flex h-10 shrink-0 items-center justify-center gap-2 px-2 text-sm font-extrabold leading-none text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-active hover:text-primary-active",
                    isActive && "text-primary-active",
                    interactiveMotionTransitionClassName,
                  )}
                  href={item.href}
                  key={item.href}
                >
                  <span aria-hidden="true" className="shrink-0">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-2">
            <Link
              className={cn(
                "inline-flex h-10 shrink-0 items-center justify-center px-2 text-sm font-extrabold leading-none text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-active hover:text-primary-active",
                interactiveMotionTransitionClassName,
              )}
              href="/cart"
            >
              Корзина{cartItemsCount > 0 ? ` (${cartItemsCount})` : ""}
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
