"use client";

import { IconUserCheck, IconUserOff } from "@tabler/icons-react";

import { Button, Dialog } from "@/components/ui";
import { showSuccessNotification } from "@/components/ui/notification";
import { useUpdateEmployeeStatusMutation } from "@/store/api/employees.api";

import type { EmployeeStatusDialogProps } from "./types";

export function EmployeeStatusDialog({
  employee,
  onClose,
  onExited,
  opened,
}: EmployeeStatusDialogProps) {
  const [updateStatus, { isLoading }] = useUpdateEmployeeStatusMutation();

  const handleStatusChange = async () => {
    if (!employee) return;

    const isActive = !employee.isActive;
    try {
      await updateStatus({
        employeeId: employee.id,
        data: { isActive },
      }).unwrap();
      showSuccessNotification({
        message: isActive
          ? "Доступ сотрудника восстановлен"
          : "Сотрудник отключён",
      });
      onClose();
    } catch {
      // Axios interceptor displays the API error notification.
    }
  };

  const isDisabling = employee?.isActive ?? false;
  const StatusIcon = isDisabling ? IconUserOff : IconUserCheck;

  return (
    <Dialog
      actions={
        <>
          <Button disabled={isLoading} onClick={onClose} variant="secondary">
            Отменить
          </Button>
          <Button
            leftSection={<StatusIcon aria-hidden="true" size={18} />}
            loading={isLoading}
            onClick={() => void handleStatusChange()}
            variant={isDisabling ? "danger" : "primary"}
          >
            {isDisabling ? "Отключить сотрудника" : "Включить сотрудника"}
          </Button>
        </>
      }
      closeButtonProps={{ disabled: isLoading }}
      closeOnClickOutside={!isLoading}
      closeOnEscape={!isLoading}
      description={
        isDisabling
          ? "Сотрудник сразу потеряет доступ к панели ресторана. Учётную запись можно будет включить повторно."
          : "Сотрудник снова сможет войти в панель ресторана."
      }
      icon={<StatusIcon size={22} />}
      onClose={onClose}
      onExitTransitionEnd={onExited}
      opened={opened}
      title={isDisabling ? "Отключить сотрудника?" : "Включить сотрудника?"}
      tone={isDisabling ? "danger" : "success"}
    >
      {employee ? (
        <div className="bg-surface p-md grid gap-1 rounded-lg text-sm">
          <strong>{employee.name ?? "Без имени"}</strong>
          <span className="text-secondary">{employee.phone}</span>
        </div>
      ) : null}
    </Dialog>
  );
}
