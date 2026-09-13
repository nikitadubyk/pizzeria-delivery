import type { CategoryDto } from "@/api-contracts";

export type CategoryFormValues = {
  name: string;
  sortOrder: number;
  isPublished: boolean;
};

export type CategoryFormDialogProps = {
  category: CategoryDto | null;
  onClose: () => void;
  onCreated: () => void;
  opened: boolean;
};
