"use client";

import { IconPlus } from "@tabler/icons-react";
import { Suspense, useState } from "react";

import type { EmployeeDto } from "@/api-contracts";
import { RestaurantPermissionPage } from "@/components/admin/restaurant-permission-gate";
import { Details } from "@/components/details";
import { Button, SearchInput, Table, Typography } from "@/components/ui";
import { useSearchPagination } from "@/hooks/use-search-pagination";
import { useSearchQueryValue } from "@/hooks/use-search-query-value";
import { RESTAURANT_PERMISSION as P } from "@/lib/auth/restaurant-permissions";
import { useGetEmployeesQuery } from "@/store/api/employees.api";

import { EmployeeDetailsDialog } from "./employee-details-dialog";
import { EmployeeFormDialog } from "./employee-form-dialog";
import { EmployeeStatusDialog } from "./employee-status-dialog";
import { getEmployeeColumns } from "./table-config";

const EMPLOYEES_PER_PAGE = 10;

function EmployeesPageContent() {
  const search = useSearchQueryValue();
  const [page, setPage] = useSearchPagination(search);
  const [formOpened, setFormOpened] = useState(false);
  const [editingEmployeeId, setEditingEmployeeId] = useState<string | null>(
    null
  );
  const [detailsEmployeeId, setDetailsEmployeeId] = useState<string | null>(
    null
  );
  const [detailsOpened, setDetailsOpened] = useState(false);
  const [statusEmployee, setStatusEmployee] = useState<EmployeeDto | null>(
    null
  );
  const [statusDialogOpened, setStatusDialogOpened] = useState(false);
  const query = useGetEmployeesQuery({
    page,
    limit: EMPLOYEES_PER_PAGE,
    search: search || undefined,
  });
  const { data } = query;
  const employees = data?.items ?? [];
  const total = data?.pagination.total ?? 0;
  const totalPages = Math.max(1, data?.pagination.totalPages ?? 1);

  const openCreateDialog = () => {
    setEditingEmployeeId(null);
    setFormOpened(true);
  };
  const openEditDialog = (employeeId: string) => {
    setEditingEmployeeId(employeeId);
    setFormOpened(true);
  };
  const openDetailsDialog = (employee: EmployeeDto) => {
    setDetailsEmployeeId(employee.id);
    setDetailsOpened(true);
  };
  const openStatusDialog = (employee: EmployeeDto) => {
    setStatusEmployee(employee);
    setStatusDialogOpened(true);
  };
  const columns = getEmployeeColumns({
    onEdit: openEditDialog,
    onStatusChange: openStatusDialog,
  });

  return (
    <RestaurantPermissionPage permission={P.EMPLOYEES_READ}>
      <>
        <section className="gap-lg grid min-h-full grid-rows-[auto_auto] md:h-full md:min-h-0 md:grid-rows-[auto_minmax(0,1fr)]">
          <div className="gap-md flex flex-wrap items-end justify-between">
            <div>
              <Typography muted variant="eyebrow">
                Управление доступом
              </Typography>
              <Typography className="!text-2xl sm:!text-4xl" variant="h1">
                Сотрудники
              </Typography>
            </div>
            <Button
              className="w-full md:w-auto"
              leftSection={<IconPlus aria-hidden="true" size={18} />}
              onClick={openCreateDialog}
            >
              Новый сотрудник
            </Button>
          </div>

          <div className="gap-xs flex min-h-0 min-w-0 flex-col">
            <div className="gap-xs flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <SearchInput
                className="sm:max-w-sm"
                placeholder="Найти сотрудника..."
              />
              <Typography muted variant="caption">
                {search ? "Найдено" : "Всего"}: {total}
              </Typography>
            </div>

            <Details
              className="flex min-h-0 flex-1 flex-col"
              errorMessage="Не удалось загрузить сотрудников"
              query={query}
            >
              <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
                <Table
                  ariaLabel="Список сотрудников ресторана"
                  columns={columns}
                  emptyState={
                    search
                      ? "По вашему запросу сотрудники не найдены"
                      : "Сотрудники пока не добавлены"
                  }
                  getRowAriaLabel={(employee) =>
                    `Открыть информацию о сотруднике ${employee.name ?? "Без имени"}`
                  }
                  getRowKey={(employee) => employee.id}
                  minWidth={1110}
                  onRowClick={openDetailsDialog}
                  pagination={{
                    ariaLabel: "Страницы списка сотрудников",
                    onChange: setPage,
                    total: totalPages,
                    value: page,
                    withEdges: true,
                  }}
                  rows={employees}
                />
              </div>
            </Details>
          </div>
        </section>

        <EmployeeFormDialog
          employeeId={editingEmployeeId}
          onClose={() => setFormOpened(false)}
          onCreated={() => setPage(1)}
          opened={formOpened}
        />

        <EmployeeDetailsDialog
          employeeId={detailsEmployeeId}
          onClose={() => setDetailsOpened(false)}
          onEdit={(employeeId) => {
            setDetailsOpened(false);
            openEditDialog(employeeId);
          }}
          onExited={() => setDetailsEmployeeId(null)}
          opened={detailsOpened}
        />

        <EmployeeStatusDialog
          employee={statusEmployee}
          onClose={() => setStatusDialogOpened(false)}
          onExited={() => setStatusEmployee(null)}
          opened={statusDialogOpened}
        />
      </>
    </RestaurantPermissionPage>
  );
}

export default function EmployeesPage() {
  return (
    <Suspense
      fallback={
        <div
          aria-label="Загрузка списка сотрудников"
          className="h-full min-h-0"
          role="status"
        />
      }
    >
      <EmployeesPageContent />
    </Suspense>
  );
}
