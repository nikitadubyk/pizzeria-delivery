import type {
  RestaurantDto,
  RestaurantUserDto,
  RestaurantUserRole,
} from "@/api-contracts";

export type UserFormValues = {
  restaurantId: string;
  name: string;
  phone: string;
  email: string;
  password: string;
  role: RestaurantUserRole;
  isActive: boolean;
};

export type UserFormDialogProps = {
  onClose: () => void;
  opened: boolean;
  restaurants: readonly RestaurantDto[];
  user: RestaurantUserDto | null;
};
