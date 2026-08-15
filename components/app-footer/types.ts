import type { ComponentPropsWithoutRef } from "react";

export type FooterLink = {
  href: string;
  label: string;
};

export type FooterSalesPoint = {
  address: string;
  hours: string;
  name: string;
  phone?: string;
};

export type AppFooterProps = ComponentPropsWithoutRef<"footer"> & {
  brandCaption?: string;
  brandImageAlt?: string;
  brandImageSrc?: string;
  brandName?: string;
  description?: string;
  developerHref?: string;
  developerName?: string;
  links?: FooterLink[];
  salesPoints?: FooterSalesPoint[];
};
