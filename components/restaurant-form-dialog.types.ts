import type { RestaurantDto, RestaurantStatus } from "@/api-contracts";

export type RestaurantFormValues = {
  name: string;
  slug: string;
  status: RestaurantStatus;
};

export type RestaurantFormDialogProps = {
  onClose: () => void;
  opened: boolean;
  restaurant: RestaurantDto | null;
};
