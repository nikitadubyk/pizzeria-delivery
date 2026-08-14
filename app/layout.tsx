import type { Metadata } from "next";
import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
import "@fontsource-variable/roboto";
import { AppHeader } from "@/components/app-header";
import { AppProvider } from "@/components/app-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pizzeria Delivery",
  description: "Pizzeria ordering and delivery management app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <AppProvider>
          <AppHeader
            cartItemsCount={2}
            pizzeriaName="Вкусно Дома"
            topLinks={[
              { href: "/", label: "Главная" },
              { href: "/#menu", label: "Меню" },
              { href: "/#promotions", label: "Акции" },
              { href: "/contacts", label: "Контакты" },
            ]}
          />
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
