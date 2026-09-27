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
        "group focus-visible:outline-primary-active flex min-w-0 shrink-0 items-center gap-2.5 rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 sm:gap-3",
        interactiveMotionTransitionClassName
      )}
      href="/"
    >
      <span
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-2xl group-hover:scale-[1.03] sm:h-12 sm:w-12",
          imageSrc
            ? "bg-transparent"
            : "bg-primary text-primary-contrast ring-primary/10 shadow-sm ring-1 shadow-orange-200/80"
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
          hideNameOnMobile && "hidden sm:block"
        )}
      >
        <span
          className={cn(
            "text-text block truncate font-extrabold tracking-tight uppercase",
            compact
              ? "max-w-[9.5rem] text-sm sm:max-w-none sm:text-base"
              : "text-2xl"
          )}
        >
          {name}
        </span>
        {!compact && (
          <span className="text-muted mt-1 block truncate text-xs font-bold">
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
        "text-text/75 hover:text-primary-active focus-visible:outline-primary-active rounded-xl text-sm font-extrabold outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4",
        active && "text-primary-active",
        interactiveMotionTransitionClassName,
        className
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
        <div className="border-border bg-surface rounded-3xl border p-4 shadow-sm">
          <AppLogo
            caption={logoCaption}
            compact
            imageAlt={resolvedLogoImageAlt}
            imageSrc={logoImageSrc}
            name={pizzeriaName}
          />
          <p className="text-muted mt-3 text-sm leading-snug font-bold">
            {logoCaption}
          </p>
        </div>

        <nav aria-label="Разделы сайта" className="mt-5 grid gap-2">
          {topLinks.map((item) => (
            <HeaderLink
              active={getIsActive(item.href)}
              className="border-border bg-background hover:border-primary/30 hover:bg-primary-soft flex min-h-12 items-center rounded-2xl border px-4 text-base shadow-sm"
              href={item.href}
              key={item.href}
              onClick={menuHandlers.close}
            >
              {item.label}
            </HeaderLink>
          ))}
        </nav>

        <div className="border-border mt-auto grid gap-2 border-t pt-5">
          <HeaderLink
            active={getIsActive(profileHref)}
            className="bg-secondary-active text-secondary-contrast hover:bg-secondary hover:text-secondary-contrast flex min-h-12 items-center gap-2 rounded-2xl px-4 text-base"
            href={profileHref}
            onClick={menuHandlers.close}
          >
            <IconLogin2 aria-hidden="true" size={iconSize} />
            Войти
          </HeaderLink>
          <a
            aria-label={`Позвонить в пиццерию: ${phoneLabel}`}
            className={cn(
              "border-border text-text hover:border-primary/30 hover:text-primary-active focus-visible:outline-primary-active flex min-h-12 items-center gap-2 rounded-2xl border px-4 text-base font-extrabold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4",
              interactiveMotionTransitionClassName
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
        className="border-border/80 bg-background/90 text-text supports-[backdrop-filter]:bg-background/82 sticky top-0 z-30 border-b shadow-[0_12px_30px_rgba(36,25,17,0.06)] backdrop-blur-xl"
      >
        <div className="border-border/60 hidden border-b lg:block">
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
            className="focus-visible:outline-primary-active shrink-0 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 lg:hidden"
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
              className="border-border bg-surface text-text hover:border-primary/30 hover:bg-primary-soft hover:text-primary-active inline-flex h-11 items-center gap-2 rounded-full border px-5 text-sm shadow-sm"
              href={profileHref}
            >
              <IconLogin2 aria-hidden="true" size={iconSize} />
              Войти
            </HeaderLink>
            <HeaderLink
              active={getIsActive(cartHref)}
              className="bg-primary text-primary-contrast hover:bg-primary-hover hover:text-primary-contrast inline-flex h-11 items-center justify-center rounded-full px-5 shadow-sm shadow-orange-200/80"
              href={cartHref}
            >
              {cartLabel}
            </HeaderLink>
          </div>

          <HeaderLink
            active={getIsActive(cartHref)}
            ariaLabel={cartLabel}
            className="bg-primary text-primary-contrast hover:bg-primary-hover hover:text-primary-contrast relative ml-auto inline-flex h-10 w-10 items-center justify-center rounded-2xl shadow-sm shadow-orange-200/80 sm:h-11 sm:w-11 lg:hidden"
            href={cartHref}
          >
            <span className="sr-only">{cartLabel}</span>
            <IconShoppingCart aria-hidden="true" size={20} />
            {cartItemsCount > 0 && (
              <span className="bg-secondary-active text-secondary-contrast ring-background absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] leading-none font-extrabold ring-2">
                {cartItemsCount}
              </span>
            )}
          </HeaderLink>
        </div>
      </header>
    </>
  );
}
