import type { AddonDto, CreateAddonRequest } from "@/api-contracts";

export type AddonFormValues = {
  name: string;
  price: number;
  isAvailable: boolean;
};

export type AddonFormDialogProps = {
  addon: AddonDto | null;
  opened: boolean;
  onClose: () => void;
  onCreated: () => void;
  onSave: (addon: AddonDto | null, data: CreateAddonRequest) => Promise<boolean>;
  isSaving: boolean;
};
