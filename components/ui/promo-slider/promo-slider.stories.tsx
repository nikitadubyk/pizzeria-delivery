import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Badge, Button, PromoSlider, type PromoSliderItem } from "..";

const promoItems: PromoSliderItem[] = [
  {
    action: <Button size="sm">Выбрать сет</Button>,
    badge: <Badge tone="warning">До воскресенья</Badge>,
    description:
      "Три пиццы 30 см, сырные бортики и два соуса для большого вечера.",
    eyebrow: "Акция недели",
    id: "pizza-set",
    imageAlt: "Пицца с сыром и томатами",
    imageSrc:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80",
    price: "от 1 990 ₽",
    title: "Сет для компании со скидкой 25%",
  },
  {
    action: <Button size="sm">Добавить напитки</Button>,
    badge: <Badge tone="info">Комбо</Badge>,
    description:
      "Добавьте два напитка к заказу от 1 200 ₽ и получите третий в подарок.",
    eyebrow: "Выгодно",
    id: "drinks",
    imageAlt: "Холодные напитки со льдом",
    imageSrc:
      "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=900&q=80",
    price: "3 по цене 2",
    title: "Напитки к горячей пицце",
  },
  {
    action: <Button size="sm">Собрать заказ</Button>,
    badge: <Badge tone="success">Бесплатно</Badge>,
    description:
      "При заказе от 1 500 ₽ привезем горячую пиццу без оплаты доставки.",
    eyebrow: "Доставка",
    id: "delivery",
    imageAlt: "Курьер доставляет заказ",
    imageSrc:
      "https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=900&q=80",
    title: "Бесплатная доставка в вашем районе",
  },
];

const compactItems: PromoSliderItem[] = [
  {
    badge: <Badge padding="compact">Новинка</Badge>,
    description: "Острая пицца с халапеньо и двойной моцареллой.",
    id: "spicy",
    price: "690 ₽",
    title: "Пепперони Спайси",
  },
  {
    badge: <Badge padding="compact" tone="success">-20%</Badge>,
    description: "Бургер, картофель и напиток для быстрого обеда.",
    id: "burger-lunch",
    price: "590 ₽",
    title: "Обеденный комбо",
  },
];

const meta = {
  title: "UI/PromoSlider",
  component: PromoSlider,
  args: {
    items: promoItems,
  },
  argTypes: {
    activeIndex: {
      control: "number",
    },
    onActiveIndexChange: {
      action: "active index changed",
    },
    showControls: {
      control: "boolean",
    },
    showIndicators: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof PromoSlider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {},
};

export const WithoutImages: Story = {
  args: {
    items: compactItems,
  },
};

export const TextOnly: Story = {
  args: {
    items: [
      {
        description:
          "Каждый будний день с 12:00 до 16:00 действует специальная цена на пиццу, салат и напиток.",
        id: "weekday-lunch",
        price: "от 490 ₽",
        title: "Обеденное предложение",
      },
      {
        description:
          "Соберите заказ заранее, а мы приготовим его к выбранному времени.",
        id: "pickup",
        title: "Самовывоз без ожидания",
      },
    ],
  },
};

export const ImageOnly: Story = {
  args: {
    items: [
      {
        id: "pizza-photo",
        imageAlt: "Горячая пицца на деревянной доске",
        imageSrc:
          "https://images.unsplash.com/photo-1601924582970-9238bcb495d9?auto=format&fit=crop&w=900&q=80",
      },
      {
        id: "dessert-photo",
        imageAlt: "Десерт с ягодами",
        imageSrc:
          "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=900&q=80",
      },
    ],
  },
};

export const WithoutAction: Story = {
  args: {
    items: [
      {
        badge: <Badge tone="info">Скоро</Badge>,
        description:
          "В меню появятся новые сезонные пиццы с грибами, грушей и пряным сыром.",
        eyebrow: "Анонс",
        id: "season-menu",
        imageAlt: "Пицца с сыром и зеленью",
        imageSrc:
          "https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=900&q=80",
        title: "Осеннее меню",
      },
    ],
  },
};

export const WithoutBadge: Story = {
  args: {
    items: [
      {
        action: <Button size="sm">Открыть меню</Button>,
        description: "Пицца, бургеры, салаты и десерты для семейного ужина.",
        id: "family-dinner",
        imageAlt: "Пицца на столе",
        imageSrc:
          "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=80",
        price: "от 799 ₽",
        title: "Ужин для всей семьи",
      },
    ],
  },
};

export const OnlyIndicators: Story = {
  args: {
    showControls: false,
  },
};

export const SingleOffer: Story = {
  args: {
    items: [
      {
        action: <Button size="sm">Перейти в меню</Button>,
        badge: <Badge tone="failed">Осталось мало</Badge>,
        description:
          "Сырная пицца 25 см по специальной цене для первого заказа.",
        id: "first-order",
        price: "399 ₽",
        title: "Первый заказ со скидкой",
      },
    ],
  },
};
