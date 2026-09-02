import type {
  CreateRestaurantUserRequest,
  RestaurantUserListQuery,
  UpdateRestaurantUserRequest,
} from "@/api-contracts";
import type { Restaurant, User } from "@/app/generated/prisma/client";

export type RestaurantUser = User & {
  restaurant: Pick<Restaurant, "id" | "name"> | null;
};

export type RestaurantUserPage = {
  items: RestaurantUser[];
  total: number;
};

export interface UserRepository {
  findSuperAdminByEmail(email: string): Promise<User | null>;
  findSuperAdminById(id: string): Promise<User | null>;
  findRestaurantUserPage(
    superAdminId: string,
    pagination: Required<RestaurantUserListQuery>,
  ): Promise<RestaurantUserPage>;
  findRestaurantUserById(
    superAdminId: string,
    userId: string,
  ): Promise<RestaurantUser | null>;
  restaurantExists(
    superAdminId: string,
    restaurantId: string,
  ): Promise<boolean>;
  createRestaurantUser(
    superAdminId: string,
    data: CreateRestaurantUserRequest & { password: string },
  ): Promise<RestaurantUser>;
  updateRestaurantUser(
    superAdminId: string,
    userId: string,
    data: Omit<UpdateRestaurantUserRequest, "password"> & {
      password?: string;
    },
  ): Promise<RestaurantUser>;
  deleteRestaurantUser(
    superAdminId: string,
    userId: string,
  ): Promise<RestaurantUser>;
}

export interface TokenService {
  createAccessToken(user: User): Promise<string>;
  createRefreshToken(user: User): Promise<string>;
  verifyAccessToken(token: string): Promise<string>;
  verifyRefreshToken(token: string): Promise<string>;
}

export type AuthorizationHeader = {
  authorization: string;
};
