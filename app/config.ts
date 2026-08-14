export type MenuCategoryIcon =
  "all" | "pizza" | "burger" | "snack" | "drink" | "dessert";

export type MenuProduct = {
  description: string;
  id: string;
  name: string;
  price: number;
  weight: string;
};

export type MenuCategory = {
  icon: MenuCategoryIcon;
  id: string;
  label: string;
  products: MenuProduct[];
};

export type PromoOffer = {
  badge: string;
  description: string;
  id: string;
  imageAlt: string;
  imageSrc: string;
  price?: string;
  title: string;
};

export const promoOffers: PromoOffer[] = [
  {
    badge: "Акция недели",
    description:
      "При заказе двух пицц любого размера третья пицца — в подарок.",
    id: "third-pizza",
    imageAlt: "Пицца с томатами, базиликом и моцареллой",
    imageSrc:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=1200&q=85",
    price: "3 по цене 2",
    title: "Больше пиццы для большой компании",
  },
  {
    badge: "Комбо",
    description: "Две пиццы 30 см, картофель по-деревенски и домашний лимонад.",
    id: "family-combo",
    imageAlt: "Пицца на деревянном столе",
    imageSrc:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=85",
    price: "1 490 ₽",
    title: "Семейный вечер без готовки",
  },
  {
    badge: "Доставка",
    description: "Привезем заказ бесплатно при сумме корзины от 1 200 ₽.",
    id: "free-delivery",
    imageAlt: "Коробки с горячей пиццей",
    imageSrc:
      "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=1200&q=85",
    title: "Бесплатная доставка по району",
  },
];

export const menuCategories: MenuCategory[] = [
  {
    icon: "pizza",
    id: "pizza",
    label: "Пицца",
    products: [
      {
        description: "Томаты, моцарелла, базилик и фирменный томатный соус",
        id: "margherita",
        name: "Маргарита",
        price: 579,
        weight: "30 см · 520 г",
      },
      {
        description: "Пепперони, моцарелла и пикантный томатный соус",
        id: "pepperoni",
        name: "Пепперони",
        price: 649,
        weight: "30 см · 560 г",
      },
      {
        description: "Моцарелла, пармезан, дорблю и сливочный сыр",
        id: "four-cheese",
        name: "Четыре сыра",
        price: 699,
        weight: "30 см · 510 г",
      },
    ],
  },
  {
    icon: "burger",
    id: "burgers",
    label: "Бургеры",
    products: [
      {
        description: "Говяжья котлета, чеддер, томаты, салат и соус гриль",
        id: "classic-burger",
        name: "Классический бургер",
        price: 449,
        weight: "340 г",
      },
      {
        description: "Двойная котлета, бекон, чеддер, лук и фирменный соус",
        id: "double-burger",
        name: "Двойной чизбургер",
        price: 569,
        weight: "410 г",
      },
    ],
  },
  {
    icon: "snack",
    id: "snacks",
    label: "Закуски",
    products: [
      {
        description: "Хрустящий картофель с пряными травами",
        id: "country-potatoes",
        name: "Картофель по-деревенски",
        price: 249,
        weight: "180 г",
      },
      {
        description: "Куриное филе в хрустящей панировке с соусом",
        id: "chicken-strips",
        name: "Куриные стрипсы",
        price: 329,
        weight: "210 г",
      },
    ],
  },
  {
    icon: "drink",
    id: "drinks",
    label: "Напитки",
    products: [
      {
        description: "Домашний лимонад с лимоном, мятой и льдом",
        id: "lemonade",
        name: "Цитрусовый лимонад",
        price: 219,
        weight: "500 мл",
      },
      {
        description: "Ягодный морс собственного приготовления",
        id: "berry-drink",
        name: "Клюквенный морс",
        price: 189,
        weight: "500 мл",
      },
    ],
  },
  {
    icon: "dessert",
    id: "desserts",
    label: "Десерты",
    products: [
      {
        description: "Нежный сливочный чизкейк с ягодным соусом",
        id: "cheesecake",
        name: "Чизкейк",
        price: 299,
        weight: "140 г",
      },
      {
        description: "Теплый шоколадный брауни с кусочками шоколада",
        id: "brownie",
        name: "Шоколадный брауни",
        price: 269,
        weight: "120 г",
      },
    ],
  },
];
