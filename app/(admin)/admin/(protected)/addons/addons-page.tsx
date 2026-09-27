"use client";

import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import type { AddonDto } from "@/api-contracts";
import {
  RestaurantPermissionGate,
  RestaurantPermissionPage,
} from "@/components/admin/restaurant-permission-gate";
import { Details } from "@/components/details";
import { Button, SearchInput, Table, Typography } from "@/components/ui";
import { useRestaurantPermission } from "@/hooks/use-restaurant-permission";
import { useSearchPagination } from "@/hooks/use-search-pagination";
import { useSearchQueryValue } from "@/hooks/use-search-query-value";
import { RESTAURANT_PERMISSION as P } from "@/lib/auth/restaurant-permissions";
import { useGetAddonsQuery } from "@/store/api/addons.api";
import { AddonFormDialog } from "./addon-form-dialog";
import { ADDONS_PER_PAGE, getAddonColumns } from "./config";
import { DeleteDialog } from "./delete-dialog";
import { useAddonMutations } from "./use-addon-mutations";

export function AddonsPage() {
  const search = useSearchQueryValue();
  const [page, setPage] = useSearchPagination(search);
  const [formOpened, setFormOpened] = useState(false);
  const [editingAddon, setEditingAddon] = useState<AddonDto | null>(null);
  const [addonToDelete, setAddonToDelete] = useState<AddonDto | null>(null);
  const [deleteDialogOpened, setDeleteDialogOpened] = useState(false);
  const canManage = useRestaurantPermission(P.MENU_MANAGE);
  const canManageAvailability = useRestaurantPermission(P.STOP_LIST_MANAGE);
  const { data, isError, isFetching, isLoading, refetch } = useGetAddonsQuery({
    page,
    limit: ADDONS_PER_PAGE,
    search: search || undefined,
  });
  const {
    saveAddon,
    removeAddon,
    changeAvailability,
    isSaving,
    isDeleting,
    isUpdatingAvailability,
  } = useAddonMutations();
  const addons = data?.items ?? [];
  const total = data?.pagination.total ?? 0;
  const totalPages = Math.max(1, data?.pagination.totalPages ?? 1);

  const openCreateDialog = () => {
    setEditingAddon(null);
    setFormOpened(true);
  };
  const openEditDialog = (addon: AddonDto) => {
    setEditingAddon(addon);
    setFormOpened(true);
  };
  const openDeleteDialog = (addon: AddonDto) => {
    setAddonToDelete(addon);
    setDeleteDialogOpened(true);
  };

  const handleDelete = async () => {
    if (!addonToDelete) return;
    const removed = await removeAddon(addonToDelete.id);
    if (removed) {
      setDeleteDialogOpened(false);
      if (addons.length === 1 && page > 1)
        setPage((currentPage) => currentPage - 1);
    }
  };

  const columns = getAddonColumns({
    canManage,
    canManageAvailability,
    isUpdatingAvailability,
    onAvailabilityChange: (addon, isAvailable) =>
      void changeAvailability(addon.id, isAvailable),
    onEdit: openEditDialog,
    onDelete: openDeleteDialog,
  });

  return (
    <RestaurantPermissionPage permission={P.MENU_READ}>
      <>
        <section className="gap-lg grid min-h-full grid-rows-[auto_auto] md:h-full md:min-h-0 md:grid-rows-[auto_minmax(0,1fr)]">
          <div className="gap-md flex flex-wrap items-end justify-between">
            <div>
              <Typography muted variant="eyebrow">
                Управление меню
              </Typography>
              <Typography className="text-2xl sm:text-4xl" variant="h1">
                Добавки
              </Typography>
            </div>
            <RestaurantPermissionGate permission={P.MENU_MANAGE}>
              <Button
                className="w-full md:w-auto"
                leftSection={<IconPlus aria-hidden="true" size={18} />}
                onClick={openCreateDialog}
              >
                Новая добавка
              </Button>
            </RestaurantPermissionGate>
          </div>

          <div className="gap-xs flex min-h-0 min-w-0 flex-col">
            <div className="gap-xs flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <SearchInput
                className="sm:max-w-sm"
                placeholder="Найти добавку..."
              />
              <Typography muted variant="caption">
                {search ? "Найдено" : "Всего"}: {total}
              </Typography>
            </div>
            <Details
              className="flex min-h-0 flex-1 flex-col"
              errorMessage="Не удалось загрузить добавки"
              isError={isError}
              isFetching={isFetching}
              isLoading={isLoading}
              onRetry={refetch}
            >
              <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
                <Table
                  ariaLabel="Список добавок"
                  columns={columns}
                  emptyState={
                    search
                      ? "По вашему запросу добавки не найдены"
                      : "Добавки пока не добавлены"
                  }
                  getRowKey={(addon) => addon.id}
                  minWidth={canManage ? 880 : 680}
                  pagination={{
                    ariaLabel: "Страницы списка добавок",
                    onChange: setPage,
                    total: totalPages,
                    value: page,
                    withEdges: true,
                  }}
                  rows={addons}
                />
              </div>
            </Details>
          </div>
        </section>

        <RestaurantPermissionGate permission={P.MENU_MANAGE}>
          <AddonFormDialog
            addon={editingAddon}
            isSaving={isSaving}
            onClose={() => setFormOpened(false)}
            onCreated={() => setPage(1)}
            onSave={saveAddon}
            opened={formOpened}
          />
        </RestaurantPermissionGate>

        <DeleteDialog
          addon={addonToDelete}
          isDeleting={isDeleting}
          opened={deleteDialogOpened}
          onClose={() => {
            if (!isDeleting) setDeleteDialogOpened(false);
          }}
          onConfirm={() => void handleDelete()}
          onExitTransitionEnd={() => setAddonToDelete(null)}
        />
      </>
    </RestaurantPermissionPage>
  );
}
