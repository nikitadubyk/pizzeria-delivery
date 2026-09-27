import { IconEdit, IconUserCheck, IconUserOff } from "@tabler/icons-react";

import type { EmployeeDto } from "@/api-contracts";
import { Badge, Button, type TableColumn } from "@/components/ui";
import { formatDateTime } from "@/lib/date";

type EmployeeTableActions = {
  onEdit: (employeeId: string) => void;
  onStatusChange: (employee: EmployeeDto) => void;
};

export const getEmployeeColumns = ({
  onEdit,
  onStatusChange,
}: EmployeeTableActions): readonly TableColumn<EmployeeDto>[] => [
  {
    key: "name",
    header: "Сотрудник",
    mobileLayout: "primary",
    render: (employee) => (
      <span className="font-extrabold break-words">
        {employee.name ?? "Без имени"}
      </span>
    ),
    width: 220,
  },
  {
    key: "contacts",
    header: "Контакты",
    mobileFullWidth: true,
    render: (employee) => (
      <div className="grid gap-1">
        <span className="whitespace-nowrap">{employee.phone}</span>
        {employee.email ? (
          <span className="text-secondary text-xs break-all">
            {employee.email}
          </span>
        ) : null}
      </div>
    ),
    width: 260,
  },
  {
    key: "status",
    header: "Статус",
    render: (employee) => (
      <Badge tone={employee.isActive ? "success" : "neutral"}>
        {employee.isActive ? "Активен" : "Отключён"}
      </Badge>
    ),
    width: 140,
  },
  {
    key: "updatedAt",
    header: "Обновлён",
    render: (employee) => (
      <time className="whitespace-nowrap" dateTime={employee.updatedAt}>
        {formatDateTime(employee.updatedAt)}
      </time>
    ),
    width: 190,
  },
  {
    key: "actions",
    header: "Действия",
    align: "right",
    mobileLayout: "full",
    render: (employee) => (
      <div
        className="gap-xs grid w-full grid-cols-1 md:flex md:w-auto md:flex-nowrap md:justify-end"
        onClick={(event) => event.stopPropagation()}
      >
        <Button
          className="w-full whitespace-nowrap md:w-auto"
          leftSection={<IconEdit aria-hidden="true" size={16} />}
          onClick={() => onEdit(employee.id)}
          size="xs"
          variant="ghost"
        >
          Изменить
        </Button>
        <Button
          className="w-full whitespace-nowrap md:w-auto"
          leftSection={
            employee.isActive ? (
              <IconUserOff aria-hidden="true" size={16} />
            ) : (
              <IconUserCheck aria-hidden="true" size={16} />
            )
          }
          onClick={() => onStatusChange(employee)}
          size="xs"
          variant={employee.isActive ? "danger" : "secondary"}
        >
          {employee.isActive ? "Отключить" : "Включить"}
        </Button>
      </div>
    ),
    width: 300,
  },
];
