"use client";

import { IconEdit, IconUser } from "@tabler/icons-react";

import { Details } from "@/components/details";
import { Badge, Button, Dialog } from "@/components/ui";
import { formatDateTime } from "@/lib/date";
import { useGetEmployeeQuery } from "@/store/api/employees.api";

import type { EmployeeDetailsDialogProps } from "./types";

export function EmployeeDetailsDialog({
  employeeId,
  onClose,
  onEdit,
  onExited,
  opened,
}: EmployeeDetailsDialogProps) {
  const query = useGetEmployeeQuery(
    { employeeId: employeeId ?? "" },
    { skip: !employeeId }
  );
  const employee = query.currentData;

  return (
    <Dialog
      actions={
        <>
          <Button onClick={onClose} variant="secondary">
            Закрыть
          </Button>
          {employee ? (
            <Button
              leftSection={<IconEdit aria-hidden="true" size={18} />}
              onClick={() => onEdit(employee.id)}
            >
              Изменить
            </Button>
          ) : null}
        </>
      }
      description="Данные и состояние доступа сотрудника."
      icon={<IconUser size={22} />}
      onClose={onClose}
      onExitTransitionEnd={onExited}
      opened={opened}
      size="lg"
      title={employee?.name ?? "Информация о сотруднике"}
    >
      <Details
        className="min-h-48"
        errorMessage="Не удалось загрузить сотрудника"
        query={query}
      >
        {employee ? (
          <dl className="gap-x-lg gap-y-md m-0 grid grid-cols-1 sm:grid-cols-2">
            <div className="grid min-w-0 gap-1 sm:col-span-2">
              <dt className="text-muted text-xs font-bold">Имя</dt>
              <dd className="m-0 font-extrabold break-words">
                {employee.name ?? "Не указано"}
              </dd>
            </div>
            <div className="grid min-w-0 gap-1">
              <dt className="text-muted text-xs font-bold">Телефон</dt>
              <dd className="m-0 font-semibold">{employee.phone}</dd>
            </div>
            <div className="grid min-w-0 gap-1">
              <dt className="text-muted text-xs font-bold">Email</dt>
              <dd className="m-0 font-semibold break-all">
                {employee.email ?? "Не указан"}
              </dd>
            </div>
            <div className="grid min-w-0 gap-1">
              <dt className="text-muted text-xs font-bold">Статус</dt>
              <dd className="m-0">
                <Badge tone={employee.isActive ? "success" : "neutral"}>
                  {employee.isActive ? "Активен" : "Отключён"}
                </Badge>
              </dd>
            </div>
            <div className="grid min-w-0 gap-1">
              <dt className="text-muted text-xs font-bold">Создан</dt>
              <dd className="m-0 font-semibold">
                <time dateTime={employee.createdAt}>
                  {formatDateTime(employee.createdAt)}
                </time>
              </dd>
            </div>
          </dl>
        ) : null}
      </Details>
    </Dialog>
  );
}
