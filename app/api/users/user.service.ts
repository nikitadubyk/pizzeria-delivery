import type {
  CreateRestaurantUserRequest,
  RestaurantUserListQuery,
  SuperAdminLoginRequest,
  SuperAdminLoginResponse,
  SuperAdminRefreshRequest,
  SuperAdminRefreshResponse,
  SuperAdminUserDto,
  UpdateRestaurantUserRequest,
} from "@/api-contracts";
import { TokenSecret } from "@/app/api/users/config";
import { toSuperAdminUserDto } from "@/app/api/users/user.mapper";
import type {
  RestaurantUser,
  TokenService,
  UserRepository,
} from "@/app/api/users/types";
import { Prisma, type User } from "@/app/generated/prisma/client";
import { ApiError, HttpStatus } from "@/app/api/common/api-response";
import { getSuperAdminDb, systemDb } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/auth/crypto";
import { JwtService } from "@/lib/auth/jwt.service";

export type { TokenService, UserRepository } from "@/app/api/users/types";

export class UserServiceError extends ApiError {
  constructor(message: string, status: HttpStatus) {
    super(message, status);
    this.name = "UserServiceError";
  }
}

const mapRepositoryError = (error: unknown): never => {
  if (error instanceof UserServiceError) throw error;

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      throw new UserServiceError(
        "Пользователь с таким email или телефоном уже существует",
        HttpStatus.CONFLICT,
      );
    }

    if (error.code === "P2025") {
      throw new UserServiceError(
        "Пользователь не найден",
        HttpStatus.NOT_FOUND,
      );
    }

    if (error.code === "P2003") {
      throw new UserServiceError("Ресторан не найден", HttpStatus.NOT_FOUND);
    }
  }

  throw error;
};

class JwtTokenService implements TokenService {
  private readonly access = new JwtService({ secret: TokenSecret.ACCESS_TOKEN });
  private readonly refresh = new JwtService({ secret: TokenSecret.REFRESH_TOKEN });

  createAccessToken(user: User) {
    return this.access.sign(user.id, { role: user.role, type: "access" }, "1h");
  }

  createRefreshToken(user: User) {
    return this.refresh.sign(user.id, { type: "refresh" }, "30d");
  }

  async verifyAccessToken(token: string) {
    try {
      const payload = await this.access.verify(token);

      if (
        payload.type !== "access" ||
        payload.role !== "SUPER_ADMIN" ||
        !payload.sub
      ) {
        throw new Error("Некорректный access token");
      }

      return payload.sub;
    } catch {
      throw new UserServiceError(
        "Access token недействителен или истёк",
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async verifyRefreshToken(token: string) {
    try {
      const payload = await this.refresh.verify(token);

      if (payload.type !== "refresh" || !payload.sub) {
        throw new Error("Некорректный refresh token");
      }

      return payload.sub;
    } catch {
      throw new UserServiceError(
        "Refresh token недействителен или истёк",
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}

export class UserService {
  constructor(
    private readonly repository: UserRepository,
    private readonly tokenService: TokenService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return hashPassword(password);
  }

  verifyPassword(password: string, passwordHash: string): Promise<boolean> {
    return verifyPassword(password, passwordHash);
  }

  async login(input: SuperAdminLoginRequest): Promise<SuperAdminLoginResponse> {
    const user = await this.repository.findSuperAdminByEmail(input.email);

    if (!user || !(await this.verifyPassword(input.password, user.password))) {
      throw new UserServiceError(
        "Неверный email или пароль",
        HttpStatus.UNAUTHORIZED,
      );
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.createAccessToken(user),
      this.tokenService.createRefreshToken(user),
    ]);

    return {
      user: toSuperAdminUserDto(user),
      accessToken,
      refreshToken,
    };
  }

  async refresh(
    input: SuperAdminRefreshRequest,
  ): Promise<SuperAdminRefreshResponse> {
    const userId = await this.tokenService.verifyRefreshToken(
      input.refreshToken,
    );
    const user = await this.repository.findSuperAdminById(userId);

    if (!user) {
      throw new UserServiceError(
        "Super admin не найден или заблокирован",
        HttpStatus.UNAUTHORIZED,
      );
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.createAccessToken(user),
      this.tokenService.createRefreshToken(user),
    ]);

    return { accessToken, refreshToken };
  }

  async getCurrentSuperAdmin(accessToken: string): Promise<SuperAdminUserDto> {
    const userId = await this.tokenService.verifyAccessToken(accessToken);
    const user = await this.repository.findSuperAdminById(userId);

    if (!user) {
      throw new UserServiceError(
        "Super admin не найден или заблокирован",
        HttpStatus.UNAUTHORIZED,
      );
    }

    return toSuperAdminUserDto(user);
  }

  getRestaurantUserPage(
    superAdminId: string,
    pagination: Required<RestaurantUserListQuery>,
  ) {
    return this.repository.findRestaurantUserPage(superAdminId, pagination);
  }

  async getRestaurantUserById(
    superAdminId: string,
    userId: string,
  ): Promise<RestaurantUser> {
    const user = await this.repository.findRestaurantUserById(
      superAdminId,
      userId,
    );

    if (!user) {
      throw new UserServiceError(
        "Пользователь не найден",
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }

  async createRestaurantUser(
    superAdminId: string,
    input: CreateRestaurantUserRequest,
  ): Promise<RestaurantUser> {
    if (
      !(await this.repository.restaurantExists(
        superAdminId,
        input.restaurantId,
      ))
    ) {
      throw new UserServiceError("Ресторан не найден", HttpStatus.NOT_FOUND);
    }

    try {
      return await this.repository.createRestaurantUser(superAdminId, {
        ...input,
        password: await this.hashPassword(input.password),
      });
    } catch (error) {
      return mapRepositoryError(error);
    }
  }

  async updateRestaurantUser(
    superAdminId: string,
    userId: string,
    input: UpdateRestaurantUserRequest,
  ): Promise<RestaurantUser> {
    const user = await this.getRestaurantUserById(superAdminId, userId);

    if (
      input.restaurantId &&
      input.restaurantId !== user.restaurantId &&
      !(await this.repository.restaurantExists(
        superAdminId,
        input.restaurantId,
      ))
    ) {
      throw new UserServiceError("Ресторан не найден", HttpStatus.NOT_FOUND);
    }

    const data = {
      ...input,
      ...(input.password
        ? { password: await this.hashPassword(input.password) }
        : {}),
    };

    try {
      return await this.repository.updateRestaurantUser(
        superAdminId,
        userId,
        data,
      );
    } catch (error) {
      return mapRepositoryError(error);
    }
  }

  async deleteRestaurantUser(
    superAdminId: string,
    userId: string,
  ): Promise<RestaurantUser> {
    await this.getRestaurantUserById(superAdminId, userId);

    try {
      return await this.repository.deleteRestaurantUser(superAdminId, userId);
    } catch (error) {
      return mapRepositoryError(error);
    }
  }
}

const userRepository: UserRepository = {
  findSuperAdminByEmail: (email) =>
    systemDb.user.findFirst({
      where: {
        email: { equals: email, mode: "insensitive" },
        role: "SUPER_ADMIN",
        restaurantId: null,
        isActive: true,
      },
    }),
  findSuperAdminById: (id) =>
    systemDb.user.findFirst({
      where: {
        id,
        role: "SUPER_ADMIN",
        restaurantId: null,
        isActive: true,
      },
    }),
  findRestaurantUserPage: async (superAdminId, { page, limit }) => {
    const db = await getSuperAdminDb(superAdminId);
    const where: Prisma.UserWhereInput = {
      restaurantId: { not: null },
      role: { in: ["OWNER", "EMPLOYEE"] },
    };
    const [items, total] = await db.$transaction([
      db.user.findMany({
        where,
        include: { restaurant: { select: { id: true, name: true } } },
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.user.count({ where }),
    ]);

    return { items, total };
  },
  findRestaurantUserById: async (superAdminId, userId) => {
    const db = await getSuperAdminDb(superAdminId);
    return db.user.findFirst({
      where: {
        id: userId,
        restaurantId: { not: null },
        role: { in: ["OWNER", "EMPLOYEE"] },
      },
      include: { restaurant: { select: { id: true, name: true } } },
    });
  },
  restaurantExists: async (superAdminId, restaurantId) => {
    const db = await getSuperAdminDb(superAdminId);
    return Boolean(
      await db.restaurant.findUnique({
        where: { id: restaurantId },
        select: { id: true },
      }),
    );
  },
  createRestaurantUser: async (superAdminId, data) => {
    const db = await getSuperAdminDb(superAdminId);
    return db.user.create({
      data,
      include: { restaurant: { select: { id: true, name: true } } },
    });
  },
  updateRestaurantUser: async (superAdminId, userId, data) => {
    const db = await getSuperAdminDb(superAdminId);
    return db.user.update({
      where: {
        id: userId,
        restaurantId: { not: null },
        role: { in: ["OWNER", "EMPLOYEE"] },
      },
      data,
      include: { restaurant: { select: { id: true, name: true } } },
    });
  },
  deleteRestaurantUser: async (superAdminId, userId) => {
    const db = await getSuperAdminDb(superAdminId);
    return db.user.delete({
      where: {
        id: userId,
        restaurantId: { not: null },
        role: { in: ["OWNER", "EMPLOYEE"] },
      },
      include: { restaurant: { select: { id: true, name: true } } },
    });
  },
};

export const userService = new UserService(
  userRepository,
  new JwtTokenService(),
);
