export type SuperAdminUser = {
  id: string;
  restaurantId: null;
  phone: string | null;
  email: string | null;
  name: string | null;
  role: "SUPER_ADMIN";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
