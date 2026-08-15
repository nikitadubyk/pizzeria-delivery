import { Image } from "@mantine/core";
import {
  IconClock,
  IconPhone,
  IconMapPin,
  IconBrandTelegram,
} from "@tabler/icons-react";
import Link from "next/link";

import { cn, interactiveTransitionClassName } from "@/lib/class-names";

import { PageContainer } from "../page-container";
import { defaultFooterLinks, defaultFooterSalesPoints } from "./config";
import type { AppFooterProps, FooterLink, FooterSalesPoint } from "./types";

export { defaultFooterLinks, defaultFooterSalesPoints } from "./config";
export type { AppFooterProps, FooterLink, FooterSalesPoint } from "./types";

function PizzaMark() {
  return (
    <svg aria-hidden="true" className="h-9 w-9" fill="none" viewBox="0 0 48 48">
      <path
        d="M14.2 34.7 21.1 15c.8-2.4 3.9-3.1 5.7-1.3l14.5 14.5c1.8 1.8 1.1 4.9-1.3 5.7l-19.7 6.9a4.8 4.8 0 0 1-6.1-6.1Z"
        fill="currentColor"
      />
      <path
        d="M19.7 16.9c5.9-2.8 16 1 19.8 9.5 1.2 2.6.7 5.1-.9 6.2-1.6 1.2-3.6.2-4.2-2.1-1.9-6.4-8.4-9-13-7.5-2.4.8-4.2-.5-4.3-2.4-.1-1.4.8-2.8 2.6-3.7Z"
        fill="var(--app-color-secondary-active)"
      />
      <circle
        cx="23.2"
        cy="28.3"
        r="2.3"
        fill="var(--app-color-secondary-active)"
      />
      <circle
        cx="30.5"
        cy="32.8"
        r="2.3"
        fill="var(--app-color-secondary-active)"
      />
    </svg>
  );
}

function Brand({
  caption,
  imageAlt,
  imageSrc,
  name,
}: {
  caption: string;
  imageAlt: string;
  imageSrc?: string;
  name: string;
}) {
  return (
    <Link
      aria-label={`${name} — на главную`}
      className="group inline-flex items-center gap-3 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-secondary-active"
      href="/"
    >
      <span
        className={cn(
          "flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-[1.25rem] transition-transform duration-200 group-hover:scale-105 motion-reduce:transition-none",
          imageSrc
            ? "bg-transparent"
            : "bg-primary text-primary-contrast shadow-[0_10px_30px_rgba(255,101,15,0.22)]",
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
          <PizzaMark />
        )}
      </span>
      <span className="leading-none">
        <span className="block text-xl font-extrabold uppercase tracking-[-0.04em] text-white">
          {name}
        </span>
        <span className="mt-1.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-white/50">
          {caption}
        </span>
      </span>
    </Link>
  );
}

const footerLinkClassName = cn(
  "w-fit rounded-md text-sm font-bold leading-snug text-white/68 outline-none hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-secondary-active",
  interactiveTransitionClassName,
);

function LinkColumn({ links }: { links: FooterLink[] }) {
  return (
    <ul className="m-0 grid list-none gap-3 p-0">
      {links.map((link) => (
        <li key={link.href}>
          <Link className={footerLinkClassName} href={link.href}>
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function SalesPoint({ point }: { point: FooterSalesPoint }) {
  const phoneHref = point.phone
    ? `tel:${point.phone.replace(/[^\d+]/g, "")}`
    : undefined;

  return (
    <li className="rounded-2xl border border-white/10 bg-white/4.5 p-4">
      <p className="m-0 flex items-center gap-2 text-sm font-extrabold text-white">
        <IconMapPin aria-hidden="true" className="text-primary" size={18} />
        {point.name}
      </p>
      <p className="mb-0 mt-2 text-sm font-bold text-white/70">
        {point.address}
      </p>
      <p className="mb-0 mt-2 flex items-center gap-2 text-xs font-medium text-white/48">
        <IconClock aria-hidden="true" size={15} />
        {point.hours}
      </p>
      {point.phone && phoneHref && (
        <a
          aria-label={`Позвонить в точку ${point.name}: ${point.phone}`}
          className={cn(
            footerLinkClassName,
            "mt-2 inline-flex items-center gap-2 text-xs",
          )}
          href={phoneHref}
        >
          <IconPhone aria-hidden="true" size={15} />
          {point.phone}
        </a>
      )}
    </li>
  );
}

export function AppFooter({
  className,
  brandCaption = "пиццерия & доставка",
  brandImageAlt,
  brandImageSrc,
  brandName = "Вкусно Дома",
  links = defaultFooterLinks,
  developerHref = "https://t.me/",
  developerName = "Команда разработки",
  salesPoints = defaultFooterSalesPoints,
  description = "Готовим пиццу после заказа и доставляем её горячей.",
  ...props
}: AppFooterProps) {
  const primaryLinks = links.slice(0, 3);
  const legalLinks = links.slice(3);
  const salesPointCountLabel = `${salesPoints.length} ${salesPoints.length === 1 ? "адрес" : "адреса"}`;
  const resolvedBrandImageAlt = brandImageAlt ?? `Логотип ${brandName}`;

  return (
    <footer
      className={cn(
        "relative overflow-hidden bg-secondary-active text-white",
        className,
      )}
      {...props}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-44 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
      />
      <PageContainer className="relative py-12 sm:py-14 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <section className="lg:col-span-3" aria-label="О пиццерии">
            <Brand
              caption={brandCaption}
              imageAlt={resolvedBrandImageAlt}
              imageSrc={brandImageSrc}
              name={brandName}
            />
            <p className="mb-0 mt-5 max-w-[18rem] text-sm font-medium leading-relaxed text-white/58">
              {description}
            </p>
          </section>

          <nav
            aria-label="Навигация в подвале"
            className="grid grid-cols-2 gap-6 sm:gap-8 lg:col-span-4"
          >
            <div>
              <h2 className="mb-4 mt-0 text-xs font-extrabold uppercase tracking-[0.14em] text-white/38">
                Навигация
              </h2>
              <LinkColumn links={primaryLinks} />
            </div>
            <div>
              <h2 className="mb-4 mt-0 text-xs font-extrabold uppercase tracking-[0.14em] text-white/38">
                Документы
              </h2>
              <LinkColumn links={legalLinks} />
            </div>
          </nav>

          <section
            className="md:col-span-2 lg:col-span-5"
            aria-labelledby="sales-points-title"
          >
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p className="m-0 text-xs font-extrabold uppercase tracking-[0.14em] text-primary">
                  Всегда рядом
                </p>
                <h2
                  className="mb-0 mt-1 text-xl font-extrabold text-white"
                  id="sales-points-title"
                >
                  Точки продаж
                </h2>
              </div>
              <span className="rounded-full bg-white/8 px-3 py-1 text-xs font-bold text-white/50">
                {salesPointCountLabel}
              </span>
            </div>
            <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2">
              {salesPoints.map((point) => (
                <SalesPoint
                  key={`${point.name}-${point.address}`}
                  point={point}
                />
              ))}
            </ul>
          </section>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs font-medium text-white/42 sm:flex-row sm:items-center sm:justify-between">
          <p className="m-0">
            © {new Date().getFullYear()} {brandName}. Все права защищены.
          </p>
          <a
            className={cn(
              "group inline-flex w-fit items-center gap-2 rounded-full border border-dashed border-white/18 px-3 py-2 text-white/52 outline-none hover:border-primary/50 hover:text-white focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-secondary-active",
              interactiveTransitionClassName,
            )}
            href={developerHref}
            rel="noreferrer"
            target="_blank"
          >
            <IconBrandTelegram
              size={17}
              aria-hidden="true"
              className="text-primary"
            />
            Разработано: <span className="font-extrabold">{developerName}</span>
          </a>
        </div>
      </PageContainer>
    </footer>
  );
}
