import type { User } from "@/app/generated/prisma/client";

export interface UserRepository {
  findSuperAdminByEmail(email: string): Promise<User | null>;
  findSuperAdminById(id: string): Promise<User | null>;
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
