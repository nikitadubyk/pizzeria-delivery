"use client";

import type { AddonDto, CreateAddonRequest } from "@/api-contracts";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@/components/ui/notification";
import {
  useCreateAddonMutation,
  useDeleteAddonMutation,
  useUpdateAddonAvailabilityMutation,
  useUpdateAddonMutation,
} from "@/store/api/addons.api";
import { getApiErrorMessage } from "@/store/api/error";

export function useAddonMutations() {
  const [createAddon, { isLoading: isCreating }] = useCreateAddonMutation();
  const [updateAddon, { isLoading: isUpdating }] = useUpdateAddonMutation();
  const [deleteAddon, { isLoading: isDeleting }] = useDeleteAddonMutation();
  const [updateAvailability, { isLoading: isUpdatingAvailability }] =
    useUpdateAddonAvailabilityMutation();

  const saveAddon = async (
    addon: AddonDto | null,
    data: CreateAddonRequest
  ): Promise<boolean> => {
    try {
      if (addon) {
        await updateAddon({ addonId: addon.id, data }).unwrap();
        showSuccessNotification({ message: "Добавка обновлена" });
      } else {
        await createAddon(data).unwrap();
        showSuccessNotification({ message: "Добавка создана" });
      }
      return true;
    } catch (error) {
      showErrorNotification({
        message: getApiErrorMessage(error, "Не удалось сохранить добавку"),
      });
      return false;
    }
  };

  const removeAddon = async (addonId: string): Promise<boolean> => {
    try {
      await deleteAddon({ addonId }).unwrap();
      showSuccessNotification({ message: "Добавка удалена" });
      return true;
    } catch (error) {
      showErrorNotification({
        message: getApiErrorMessage(error, "Не удалось удалить добавку"),
      });
      return false;
    }
  };

  const changeAvailability = async (
    addonId: string,
    isAvailable: boolean
  ): Promise<void> => {
    try {
      await updateAvailability({ addonId, data: { isAvailable } }).unwrap();
      showSuccessNotification({
        message: isAvailable ? "Добавка доступна" : "Добавка в стоп-листе",
      });
    } catch (error) {
      showErrorNotification({
        message: getApiErrorMessage(
          error,
          "Не удалось изменить доступность добавки"
        ),
      });
    }
  };

  return {
    saveAddon,
    removeAddon,
    changeAvailability,
    isSaving: isCreating || isUpdating,
    isDeleting,
    isUpdatingAvailability,
  };
}
