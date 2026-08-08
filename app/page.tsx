import {
  IconArrowRight,
  IconBike,
  IconChefHat,
  IconClockHour4,
  IconMapPin,
  IconPhone,
  IconPizza,
  IconSearch,
  IconShoppingBag,
  IconSparkles,
  IconTruckDelivery,
  IconUser,
} from "@tabler/icons-react";
import type { ReactNode } from "react";
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Input,
  RadioGroup,
  Tabs,
  Textarea,
  Toggle,
} from "@/components/ui";

const iconSize = 18;

const sizeOptions = [
  { value: "small", label: "Маленькая", description: "Для одного перекуса" },
  { value: "medium", label: "Средняя", description: "Самый частый выбор" },
  { value: "large", label: "Большая", description: "Для компании" },
];

const addonOptions = [
  { value: "cheese", label: "Двойной сыр", description: "+79 ₽" },
  { value: "basil", label: "Свежий базилик", description: "+49 ₽" },
  { value: "mushrooms", label: "Грибы", description: "+69 ₽" },
];

function Panel({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-surface/70 p-6 shadow-sm">
      <span className="text-xs font-extrabold uppercase tracking-normal text-muted">
        {eyebrow}
      </span>
      <h2 className="mt-2 text-2xl font-extrabold text-text">{title}</h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="flex-1 bg-background px-5 py-10 text-text">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <section className="overflow-hidden rounded-3xl bg-secondary-active text-secondary-contrast shadow-lg">
          <div className="grid gap-8 px-8 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-extrabold">
                <IconSparkles size={iconSize} />
                UI Kit
              </span>
              <h1 className="mt-6 text-4xl font-extrabold">
                Премиальные базовые компоненты для пиццерии
              </h1>
              <p className="mt-4 max-w-xl text-lg text-white/78">
                Пока оставляем только основу: кнопки, поля, переключатели, выбор
                опций и табы. Все цвета идут из одной темы Mantine и Tailwind.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  leftSection={<IconShoppingBag size={iconSize} />}
                  rightSection={<IconArrowRight size={iconSize} />}
                >
                  Собрать заказ
                </Button>
                <Button
                  leftSection={<IconBike size={iconSize} />}
                  variant="secondary"
                >
                  Доставка
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/8 p-5">
              <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <p className="text-sm text-white/64">Активный заказ</p>
                  <p className="mt-1 text-xl font-extrabold">Маргарита x2</p>
                </div>
                <IconPizza size={34} />
              </div>
              <div className="mt-5 grid gap-3 text-sm text-white/78">
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2">
                    <IconClockHour4 size={iconSize} />
                    Кухня
                  </span>
                  <strong className="text-white">12 мин</strong>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2">
                    <IconTruckDelivery size={iconSize} />
                    Курьер
                  </span>
                  <strong className="text-white">в пути</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <Panel eyebrow="Actions" title="Кнопки">
            <div className="flex flex-wrap gap-3">
              <Button leftSection={<IconPizza size={iconSize} />}>
                Заказать
              </Button>
              <Button
                leftSection={<IconShoppingBag size={iconSize} />}
                variant="dark"
              >
                В корзину
              </Button>
              <Button leftSection={<IconBike size={iconSize} />} variant="secondary">
                Самовывоз
              </Button>
              <Button variant="ghost">Назад</Button>
            </div>
          </Panel>

          <Panel eyebrow="Controls" title="Переключатели">
            <div className="grid gap-4">
              <Toggle
                defaultChecked
                label="Показывать только доступные блюда"
              />
              <Checkbox label="Не звонить, написать в чат" />
            </div>
          </Panel>
        </section>

        <Panel eyebrow="Checkout" title="Поля заказа">
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Имя"
              leftSection={<IconUser size={iconSize} />}
              placeholder="Иван Иванов"
            />
            <Input
              label="Телефон"
              leftSection={<IconPhone size={iconSize} />}
              placeholder="+7 (___) ___-__-__"
            />
            <Input
              className="md:col-span-2"
              label="Адрес доставки"
              leftSection={<IconMapPin size={iconSize} />}
              placeholder="Улица, дом, квартира"
            />
            <Input
              className="md:col-span-2"
              label="Поиск по меню"
              leftSection={<IconSearch size={iconSize} />}
              placeholder="Пицца, напитки, закуски..."
            />
            <Textarea
              className="md:col-span-2"
              label="Комментарий"
              placeholder="Например: домофон не работает"
            />
          </div>
        </Panel>

        <section className="grid gap-5 lg:grid-cols-2">
          <Panel eyebrow="Options" title="Выбор пиццы">
            <div className="grid gap-6">
              <RadioGroup
                defaultValue="medium"
                label="Размер"
                options={sizeOptions}
              />
              <CheckboxGroup
                defaultValue={["cheese"]}
                label="Добавки"
                options={addonOptions}
              />
            </div>
          </Panel>

          <Panel eyebrow="Navigation" title="Табы">
            <Tabs
              items={[
                {
                  value: "menu",
                  label: "Меню",
                  icon: <IconPizza size={iconSize} />,
                  content:
                    "Категории, поиск и быстрый выбор блюд для клиентского сайта.",
                },
                {
                  value: "kitchen",
                  label: "Кухня",
                  icon: <IconChefHat size={iconSize} />,
                  content:
                    "Состояния приготовления и плотная очередь заказов для смены.",
                },
                {
                  value: "delivery",
                  label: "Доставка",
                  icon: <IconTruckDelivery size={iconSize} />,
                  content:
                    "Маршруты курьеров, контакты клиентов и время прибытия.",
                },
              ]}
            />
          </Panel>
        </section>
      </div>
    </main>
  );
}
