export type SuperAdminUserDto = {
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

export type SuperAdminLoginRequest = {
  email: string;
  password: string;
};

export type SuperAdminLoginResponse = {
  user: SuperAdminUserDto;
  accessToken: string;
  refreshToken: string;
};

export type SuperAdminRefreshRequest = {
  refreshToken: string;
};

export type SuperAdminRefreshResponse = {
  accessToken: string;
  refreshToken: string;
};
