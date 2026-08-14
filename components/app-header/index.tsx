"use client";

import { Burger, Drawer, Image } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconLogin2,
  IconPhone,
  IconPizza,
  IconShoppingCart,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { cn, interactiveMotionTransitionClassName } from "@/lib/class-names";

export type HeaderTopLink = {
  href: string;
  label: string;
};

export type AppHeaderProps = {
  cartHref?: string;
  cartItemsCount?: number;
  logoCaption?: string;
  logoImageAlt?: string;
  logoImageSrc?: string;
  phoneLabel?: string;
  pizzeriaName?: string;
  profileHref?: string;
  topLinks?: HeaderTopLink[];
};

const iconSize = 18;

export const defaultHeaderTopLinks: HeaderTopLink[] = [
  { href: "/careers", label: "Работа у нас" },
  { href: "/about", label: "О нас" },
  { href: "/contacts", label: "Контакты" },
];

function AppLogo({
  caption,
  compact = false,
  hideNameOnMobile = false,
  imageAlt,
  imageSrc,
  name,
}: {
  caption: string;
  compact?: boolean;
  hideNameOnMobile?: boolean;
  imageAlt: string;
  imageSrc?: string;
  name: string;
}) {
  return (
    <Link
      aria-label={`На главную — ${name}`}
      className={cn(
        "group flex min-w-0 shrink-0 items-center gap-2.5 rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-active sm:gap-3",
        interactiveMotionTransitionClassName,
      )}
      href="/"
    >
      <span
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-2xl group-hover:scale-[1.03] sm:h-12 sm:w-12",
          imageSrc
            ? "bg-transparent"
            : "bg-primary text-primary-contrast shadow-sm shadow-orange-200/80 ring-1 ring-primary/10",
        )}
      >
        {imageSrc ? (
          <Image
            alt={imageAlt}
            className="h-full w-full object-contain"
            fit="contain"
            src={imageSrc}
          />
        ) : (
          <IconPizza aria-hidden="true" size={compact ? 24 : 28} stroke={2.5} />
        )}
      </span>
      <span
        className={cn(
          "min-w-0 leading-none",
          hideNameOnMobile && "hidden sm:block",
        )}
      >
        <span
          className={cn(
            "block truncate font-extrabold uppercase tracking-tight text-text",
            compact
              ? "max-w-[9.5rem] text-sm sm:max-w-none sm:text-base"
              : "text-2xl",
          )}
        >
          {name}
        </span>
        {!compact && (
          <span className="mt-1 block truncate text-xs font-bold text-muted">
            {caption}
          </span>
        )}
      </span>
    </Link>
  );
}

function HeaderLink({
  active,
  ariaLabel,
  children,
  className,
  href,
  onClick,
}: {
  active?: boolean;
  ariaLabel?: string;
  children: ReactNode;
  className?: string;
  href: string;
  onClick?: () => void;
}) {
  return (
    <Link
      aria-current={active ? "page" : undefined}
      aria-label={ariaLabel}
      className={cn(
        "rounded-xl text-sm font-extrabold text-text/75 outline-none hover:text-primary-active focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-active",
        active && "text-primary-active",
        interactiveMotionTransitionClassName,
        className,
      )}
      href={href}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}

export function AppHeader({
  logoImageAlt,
  logoImageSrc,
  cartItemsCount = 0,
  cartHref = "/cart",
  profileHref = "/profile",
  phoneLabel = "+7 800 333-00-60",
  pizzeriaName = "Pizza Delivery",
  topLinks = defaultHeaderTopLinks,
  logoCaption = "Горячая пицца с быстрой доставкой",
}: AppHeaderProps) {
  const pathname = usePathname() ?? "/";
  const [menuOpened, menuHandlers] = useDisclosure(false);

  const getIsActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const cartLabel =
    cartItemsCount > 0 ? `Корзина · ${cartItemsCount}` : "Корзина";
  const phoneHref = `tel:${phoneLabel.replace(/[^\d+]/g, "")}`;
  const resolvedLogoImageAlt = logoImageAlt ?? `Логотип ${pizzeriaName}`;

  return (
    <>
      <Drawer
        classNames={{
          body: "flex flex-col",
          close:
            "text-muted hover:bg-primary-soft hover:text-primary-active focus-visible:outline-primary-active",
          content: "bg-background text-text",
          header: "shrink-0 border-b border-border bg-background px-5 py-4",
          title: "font-extrabold text-text",
        }}
        onClose={menuHandlers.close}
        opened={menuOpened}
        position="left"
        size="min(88vw, 360px)"
        styles={{
          body: {
            flex: "1 1 0",
            minHeight: 0,
            padding: "20px 20px 24px",
          },
          content: {
            display: "flex",
            flexDirection: "column",
            height: "100%",
          },
        }}
        title="Меню"
      >
        <div className="rounded-3xl border border-border bg-surface p-4 shadow-sm">
          <AppLogo
            caption={logoCaption}
            compact
            imageAlt={resolvedLogoImageAlt}
            imageSrc={logoImageSrc}
            name={pizzeriaName}
          />
          <p className="mt-3 text-sm font-bold leading-snug text-muted">
            {logoCaption}
          </p>
        </div>

        <nav aria-label="Разделы сайта" className="mt-5 grid gap-2">
          {topLinks.map((item) => (
            <HeaderLink
              active={getIsActive(item.href)}
              className="flex min-h-12 items-center rounded-2xl border border-border bg-background px-4 text-base shadow-sm hover:border-primary/30 hover:bg-primary-soft"
              href={item.href}
              key={item.href}
              onClick={menuHandlers.close}
            >
              {item.label}
            </HeaderLink>
          ))}
        </nav>

        <div className="mt-auto grid gap-2 border-t border-border pt-5">
          <HeaderLink
            active={getIsActive(profileHref)}
            className="flex min-h-12 items-center gap-2 rounded-2xl bg-secondary-active px-4 text-base text-secondary-contrast hover:bg-secondary hover:text-secondary-contrast"
            href={profileHref}
            onClick={menuHandlers.close}
          >
            <IconLogin2 aria-hidden="true" size={iconSize} />
            Войти
          </HeaderLink>
          <a
            aria-label={`Позвонить в пиццерию: ${phoneLabel}`}
            className={cn(
              "flex min-h-12 items-center gap-2 rounded-2xl border border-border px-4 text-base font-extrabold text-text hover:border-primary/30 hover:text-primary-active focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-active",
              interactiveMotionTransitionClassName,
            )}
            href={phoneHref}
          >
            <IconPhone aria-hidden="true" size={iconSize} />
            {phoneLabel}
          </a>
        </div>
      </Drawer>

      <header
        aria-label="Основная навигация пиццерии"
        className="sticky top-0 z-30 border-b border-border/80 bg-background/90 text-text shadow-[0_12px_30px_rgba(36,25,17,0.06)] backdrop-blur-xl supports-[backdrop-filter]:bg-background/82"
      >
        <div className="hidden border-b border-border/60 lg:block">
          <div className="mx-auto flex h-9 w-full max-w-6xl items-center gap-6 px-5">
            <nav
              aria-label="Разделы сайта"
              className="flex min-w-0 items-center gap-5"
            >
              {topLinks.map((item) => (
                <HeaderLink
                  key={item.href}
                  href={item.href}
                  active={getIsActive(item.href)}
                  className={cn("inline-flex items-center py-2 text-xs")}
                >
                  {item.label}
                </HeaderLink>
              ))}
            </nav>
          </div>
        </div>

        <div className="mx-auto flex min-h-16 w-full max-w-6xl items-center gap-2.5 px-4 py-2.5 sm:gap-3 sm:px-5 lg:min-h-[76px] lg:py-3">
          <Burger
            aria-label={menuOpened ? "Закрыть меню" : "Открыть меню"}
            className="shrink-0 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-active lg:hidden"
            color="var(--app-color-text)"
            onClick={menuHandlers.toggle}
            opened={menuOpened}
            size="sm"
          />

          <AppLogo
            caption={logoCaption}
            compact
            hideNameOnMobile
            imageAlt={resolvedLogoImageAlt}
            imageSrc={logoImageSrc}
            name={pizzeriaName}
          />

          <div className="ml-auto hidden shrink-0 items-center gap-3 lg:flex">
            <HeaderLink
              active={getIsActive(profileHref)}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-surface px-5 text-sm text-text shadow-sm hover:border-primary/30 hover:bg-primary-soft hover:text-primary-active"
              href={profileHref}
            >
              <IconLogin2 aria-hidden="true" size={iconSize} />
              Войти
            </HeaderLink>
            <HeaderLink
              active={getIsActive(cartHref)}
              className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-primary-contrast shadow-sm shadow-orange-200/80 hover:bg-primary-hover hover:text-primary-contrast"
              href={cartHref}
            >
              {cartLabel}
            </HeaderLink>
          </div>

          <HeaderLink
            active={getIsActive(cartHref)}
            ariaLabel={cartLabel}
            className="relative ml-auto inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-contrast shadow-sm shadow-orange-200/80 hover:bg-primary-hover hover:text-primary-contrast sm:h-11 sm:w-11 lg:hidden"
            href={cartHref}
          >
            <span className="sr-only">{cartLabel}</span>
            <IconShoppingCart aria-hidden="true" size={20} />
            {cartItemsCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-secondary-active px-1 text-[11px] font-extrabold leading-none text-secondary-contrast ring-2 ring-background">
                {cartItemsCount}
              </span>
            )}
          </HeaderLink>
        </div>
      </header>
    </>
  );
}
