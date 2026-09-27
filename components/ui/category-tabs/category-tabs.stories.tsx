"use client";

import {
  IconBottle,
  IconBurger,
  IconCake,
  IconPizza,
  IconSalad,
} from "@tabler/icons-react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { CategoryTabs, type CategoryTabItem } from ".";

const iconSize = 18;

const categories: CategoryTabItem[] = [
  {
    id: "pizza",
    label: "Пицца",
    icon: <IconPizza size={iconSize} />,
  },
  {
    id: "burgers",
    label: "Бургеры",
    icon: <IconBurger size={iconSize} />,
  },
  {
    id: "drinks",
    label: "Напитки",
    icon: <IconBottle size={iconSize} />,
  },
  {
    id: "salads",
    label: "Салаты",
    icon: <IconSalad size={iconSize} />,
  },
  {
    id: "desserts",
    label: "Десерты",
    icon: <IconCake size={iconSize} />,
  },
];

const categoryProducts: Record<string, string[]> = {
  burgers: ["Классический бургер", "Чизбургер", "Острый бургер"],
  desserts: ["Чизкейк", "Тирамису", "Шоколадный брауни"],
  drinks: ["Кола", "Лимонад", "Морс"],
  pizza: ["Маргарита", "Пепперони", "Четыре сыра"],
  salads: ["Цезарь", "Греческий", "Овощной"],
};

const scrollDemoCategories: CategoryTabItem[] = categories.map((category) => ({
  ...category,
  id: `scroll-demo-${category.id}`,
}));

function CategoryTabsScrollDemo() {
  const [activeId, setActiveId] = useState(scrollDemoCategories[0].id);
  const activeCategory = scrollDemoCategories.find(
    (category) => category.id === activeId
  );

  return (
    <div className="grid gap-4">
      <div className="border-border bg-surface rounded-lg border p-4">
        <h2 className="text-text m-0 text-xl font-extrabold">Меню</h2>
        <p className="text-muted m-0 mt-1 text-sm">
          Нажмите на категорию или прокрутите список вниз. Активная вкладка
          изменится, когда соответствующая секция подойдет к навигации.
        </p>
        <p className="text-primary-active m-0 mt-3 text-sm font-extrabold">
          Активная категория: {activeCategory?.label}
        </p>
      </div>

      <CategoryTabs
        activeId={activeId}
        items={scrollDemoCategories}
        offset={96}
        onChange={setActiveId}
        stickyTop={0}
      />

      <div className="grid gap-8">
        {scrollDemoCategories.map((category) => {
          const sourceId = category.id.replace("scroll-demo-", "");

          return (
            <section
              key={category.id}
              className="border-border bg-background scroll-mt-28 rounded-lg border p-5"
              id={category.id}
            >
              <h3 className="text-text m-0 text-2xl font-extrabold">
                {category.label}
              </h3>
              <p className="text-muted m-0 mt-1 text-sm">
                Секция категории в общем списке меню.
              </p>

              <div className="mt-5 grid min-h-[420px] content-start gap-3 md:grid-cols-3">
                {categoryProducts[sourceId].map((product) => (
                  <article
                    key={product}
                    className="border-border bg-surface grid min-h-44 content-between rounded-lg border p-4"
                  >
                    <div>
                      <h4 className="text-md text-text m-0 font-extrabold">
                        {product}
                      </h4>
                      <p className="text-muted m-0 mt-1 text-sm">
                        Описание блюда, состав и короткие детали.
                      </p>
                    </div>
                    <span className="text-text mt-6 text-lg font-black">
                      590 ₽
                    </span>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

const meta = {
  title: "UI/CategoryTabs",
  component: CategoryTabs,
  args: {
    items: categories,
    offset: 88,
    sticky: true,
  },
} satisfies Meta<typeof CategoryTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {},
};

export const MenuNavigation: Story = {
  args: {},
  render: () => (
    <div className="grid gap-4">
      <div className="border-border bg-surface rounded-lg border p-4">
        <h2 className="text-text m-0 text-xl font-extrabold">Меню</h2>
        <p className="text-muted m-0 mt-1 text-sm">
          Прокрутите список или выберите категорию в навигации.
        </p>
      </div>

      <CategoryTabs items={categories} offset={92} stickyTop={0} />

      <div className="grid gap-8">
        {categories.map((category) => (
          <section
            key={category.id}
            className="border-border bg-background scroll-mt-24 rounded-lg border p-4"
            id={category.id}
          >
            <h3 className="text-text m-0 text-xl font-extrabold">
              {category.label}
            </h3>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {categoryProducts[category.id].map((product) => (
                <article
                  key={product}
                  className="border-border bg-surface grid min-h-36 content-between rounded-lg border p-4"
                >
                  <div>
                    <h4 className="text-md text-text m-0 font-extrabold">
                      {product}
                    </h4>
                    <p className="text-muted m-0 mt-1 text-sm">
                      Соус, сыр и свежие ингредиенты.
                    </p>
                  </div>
                  <span className="text-text mt-6 text-lg font-black">
                    590 ₽
                  </span>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  ),
};

export const ScrollSpy: Story = {
  args: {},
  render: () => <CategoryTabsScrollDemo />,
};

export const LongList: Story = {
  args: {
    items: [
      ...categories,
      { id: "sets", label: "Комбо" },
      { id: "sauces", label: "Соусы" },
      { id: "kids", label: "Детское меню" },
    ],
    sticky: false,
  },
};
