"use client";

import { IconArrowRight } from "@tabler/icons-react";

import { AppFooter } from "@/components/app-footer";
import { PageContainer } from "@/components/page-container";
import {
  Badge,
  Button,
  Card,
  CategoryTabs,
  PromoSlider,
  type PromoSliderItem,
} from "@/components/ui";

import { menuCategories, promoOffers } from "./config";
import { formatPrice, getCategoryIcon } from "./helpers";

const categoryTabs = menuCategories.map((category) => ({
  icon: getCategoryIcon(category.icon),
  id: category.id,
  label: category.label,
}));

const promoItems: PromoSliderItem[] = promoOffers.map((offer) => ({
  ...offer,
  action: (
    <Button rightSection={<IconArrowRight aria-hidden="true" size={18} />}>
      Заказать
    </Button>
  ),
  badge: <Badge tone="warning">{offer.badge}</Badge>,
  eyebrow: "Вкусно Дома",
}));

function MenuSections() {
  return (
    <div className="grid gap-12">
      {menuCategories.map((category) => (
        <section className="scroll-mt-40" id={category.id} key={category.id}>
          <div className="mb-5 flex flex-wrap items-baseline gap-2">
            <span className="text-primary-active">
              {getCategoryIcon(category.icon)}
            </span>
            <h2 className="m-0 text-2xl font-extrabold text-text">
              {category.label}
            </h2>
            <span className="text-sm text-muted">
              {category.products.length} позиции
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {category.products.map((product) => (
              <Card
                actionLabel="Выбрать"
                description={
                  <>
                    {product.description}
                    <span className="mt-2 block font-bold text-text/70">
                      {product.weight}
                    </span>
                  </>
                }
                imageLabel={`Фото: ${product.name}`}
                key={product.id}
                price={formatPrice(product.price)}
                title={product.name}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export function HomePage() {
  return (
    <>
      <main className="flex-1 bg-background pb-20 pt-6 text-text sm:pt-8">
        <PageContainer>
          <h1 className="sr-only">Меню пиццерии Вкусно Дома</h1>

          <div id="promotions" className="scroll-mt-32">
            <PromoSlider items={promoItems} />
          </div>

          <section aria-labelledby="menu-title" className="mt-8" id="menu">
            <div className="mb-3 flex items-end justify-between gap-4">
              <div>
                <p className="m-0 text-sm font-extrabold uppercase text-primary-active">
                  Готовим после заказа
                </p>
                <h2
                  className="m-0 mt-1 text-3xl font-extrabold text-text"
                  id="menu-title"
                >
                  Наше меню
                </h2>
              </div>
              <p className="m-0 hidden max-w-[24rem] text-right text-sm text-muted sm:block">
                Выберите категорию или прокрутите страницу — активная вкладка
                переключится автоматически.
              </p>
            </div>

            <CategoryTabs
              offset={128}
              stickyTop={110}
              className="mb-8"
              items={categoryTabs}
            />

            <MenuSections />
          </section>
        </PageContainer>
      </main>
      <AppFooter />
    </>
  );
}
