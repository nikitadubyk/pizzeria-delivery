import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Badge } from "../badge";
import { Button } from "../button";
import { Table, type AppTableProps, type TableColumn } from ".";

type Order = {
  id: string;
  customer: string;
  phone: string;
  address: string;
  createdAt: string;
  total: string;
  status: "Готовится" | "В пути" | "Доставлен";
};

const orders: Order[] = [
  {
    id: "ORD-1048",
    customer: "Анна Петрова",
    phone: "+7 999 123-45-67",
    address: "ул. Пушкина, 18, кв. 42",
    createdAt: "Сегодня, 18:42",
    total: "1 478 ₽",
    status: "Готовится",
  },
  {
    id: "ORD-1047",
    customer: "Михаил Орлов",
    phone: "+7 921 555-18-90",
    address: "Невский проспект, 96",
    createdAt: "Сегодня, 18:31",
    total: "2 095 ₽",
    status: "В пути",
  },
  {
    id: "ORD-1046",
    customer: "Елена Смирнова",
    phone: "+7 911 402-10-08",
    address: "Литейный проспект, 24",
    createdAt: "Сегодня, 18:05",
    total: "890 ₽",
    status: "Доставлен",
  },
];

const statusTone = {
  Готовится: "warning",
  "В пути": "info",
  Доставлен: "success",
} as const;

const columns: TableColumn<Order>[] = [
  {
    key: "id",
    header: "Заказ",
    mobileLayout: "primary",
    render: (order) => order.id,
    width: 130,
  },
  {
    key: "customer",
    header: "Клиент",
    mobileFullWidth: true,
    render: (order) => (
      <div className="grid min-w-0 gap-0.5 md:min-w-40">
        <span className="font-bold">{order.customer}</span>
        <span className="text-xs text-muted">{order.phone}</span>
      </div>
    ),
    width: 220,
  },
  {
    key: "address",
    header: "Адрес доставки",
    render: (order) => order.address,
    width: 260,
  },
  {
    key: "createdAt",
    header: "Создан",
    render: (order) => order.createdAt,
    width: 170,
  },
  {
    align: "right",
    key: "total",
    header: "Сумма",
    render: (order) => <span className="font-extrabold">{order.total}</span>,
    width: 120,
  },
  {
    key: "status",
    header: "Статус",
    render: (order) => (
      <Badge tone={statusTone[order.status]}>{order.status}</Badge>
    ),
    width: 150,
  },
  {
    align: "right",
    key: "actions",
    header: <span className="sr-only">Действия</span>,
    mobileLayout: "full",
    render: (order) => (
      <Button
        aria-label={`Открыть заказ ${order.id}`}
        className="w-full md:w-auto"
        size="sm"
        variant="secondary"
      >
        Открыть
      </Button>
    ),
    width: 120,
  },
];

const customerNames = [
  "Анна Петрова",
  "Михаил Орлов",
  "Елена Смирнова",
  "Алексей Волков",
  "Мария Соколова",
  "Дмитрий Морозов",
] as const;

const deliveryAddresses = [
  "ул. Пушкина, 18, кв. 42",
  "Невский проспект, 96",
  "Литейный проспект, 24",
  "ул. Рубинштейна, 11",
  "Каменноостровский проспект, 37",
] as const;

const orderStatuses: Order["status"][] = ["Готовится", "В пути", "Доставлен"];

const manyOrders: Order[] = Array.from({ length: 25 }, (_, index) => ({
  id: `ORD-${1048 - index}`,
  customer: customerNames[index % customerNames.length],
  phone: `+7 999 123-${String(45 + index).padStart(2, "0")}-${String(10 + index).padStart(2, "0")}`,
  address: deliveryAddresses[index % deliveryAddresses.length],
  createdAt: `Сегодня, ${String(18 - Math.floor(index / 6)).padStart(2, "0")}:${String(59 - ((index * 7) % 60)).padStart(2, "0")}`,
  total: `${780 + index * 137} ₽`,
  status: orderStatuses[index % orderStatuses.length],
}));

const manyColumns: TableColumn<Order>[] = [
  ...columns.slice(0, -1),
  {
    key: "restaurant",
    header: "Пиццерия",
    render: (_, index) =>
      ["Центральная", "Невская", "Петроградская"][index % 3],
    width: 180,
  },
  {
    key: "items",
    header: "Позиций",
    render: (_, index) => `${(index % 5) + 1} шт.`,
    width: 110,
  },
  {
    key: "payment",
    header: "Оплата",
    render: (_, index) =>
      ["Картой онлайн", "Наличными", "Терминалом"][index % 3],
    width: 160,
  },
  {
    key: "deliveryType",
    header: "Получение",
    render: (_, index) => (index % 4 === 0 ? "Самовывоз" : "Доставка"),
    width: 140,
  },
  {
    key: "courier",
    header: "Курьер",
    render: (_, index) =>
      ["Иван К.", "Олег М.", "Не назначен", "Светлана Р."][index % 4],
    width: 160,
  },
  {
    key: "source",
    header: "Источник",
    render: (_, index) => ["Сайт", "Телефон", "Администратор"][index % 3],
    width: 150,
  },
  {
    key: "comment",
    header: "Комментарий",
    mobileFullWidth: true,
    render: (_, index) => (index % 3 === 0 ? "Позвонить перед доставкой" : "—"),
    width: 240,
  },
  columns[columns.length - 1],
];

function OrderTable(props: AppTableProps<Order>) {
  return <Table {...props} />;
}

const meta = {
  title: "UI/Table",
  component: OrderTable,
  args: {
    ariaLabel: "Заказы пиццерии",
    columns,
    getRowKey: (order: Order) => order.id,
    minWidth: 1050,
    rows: orders,
  },
  parameters: {
    docs: {
      description: {
        component:
          "Адаптивная таблица: начиная с 768 px отображается полная таблица с горизонтальным скроллом, а на мобильных устройствах каждая строка превращается в карточку.",
      },
    },
  },
} satisfies Meta<typeof OrderTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Orders: Story = {};

export const MobileCards: Story = {
  args: {
    displayMode: "cards",
  },
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
};

export const TabletWithHorizontalScroll: Story = {
  args: {
    displayMode: "table",
  },
  decorators: [
    (Story) => (
      <div className="max-w-3xl">
        <Story />
      </div>
    ),
  ],
};

export const CompactTable: Story = {
  args: {
    columns: columns.filter(
      (column) => !["address", "createdAt"].includes(column.key),
    ),
    minWidth: 720,
  },
};

export const ManyRowsAndColumns: Story = {
  args: {
    ariaLabel: "Расширенный список заказов пиццерии",
    columns: manyColumns,
    minWidth: 1900,
    rows: manyOrders,
  },
};

export const Empty: Story = {
  args: {
    emptyState: "Заказы пока не поступили",
    rows: [],
  },
};
