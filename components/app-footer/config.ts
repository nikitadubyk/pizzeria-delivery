import type { FooterLink, FooterSalesPoint } from "./types";

export const defaultFooterLinks: FooterLink[] = [
  { href: "/#menu", label: "Меню" },
  { href: "/#promotions", label: "Акции" },
  { href: "/contacts", label: "Контакты и доставка" },
  { href: "/privacy", label: "Политика конфиденциальности" },
  { href: "/offer", label: "Публичная оферта" },
  { href: "/user-agreement", label: "Пользовательское соглашение" },
  {
    href: "/cookie-policy",
    label: "Политика использования файлов cookies",
  },
];

export const defaultFooterSalesPoints: FooterSalesPoint[] = [
  {
    address: "ул. Комсомольская, 13",
    hours: "Ежедневно с 10:00 до 21:00",
    name: "Горловка",
    phone: "+7 (949) 000-56-56",
  },
  {
    address: "ул. Калинина, 1",
    hours: "Ежедневно с 10:00 до 20:00",
    name: "Енакиево",
    phone: "+7 (949) 501-11-00",
  },
];
