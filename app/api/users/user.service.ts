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
import {
  BCRYPT_ROUNDS,
  TokenSecret,
  TOKEN_SECRET_MIN_LENGTH,
} from "@/app/api/users/config";
import { toSuperAdminUserDto } from "@/app/api/users/user.mapper";
import type {
  RestaurantUser,
  TokenService,
  UserRepository,
} from "@/app/api/users/types";
import { Prisma, type User } from "@/app/generated/prisma/client";
import { ApiError, HttpStatus } from "@/app/api/common/api-response";
import { getSuperAdminDb, systemDb } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { jwtVerify, SignJWT } from "jose";

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
        "Пользователь с таким email уже существует",
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

const getTokenSecret = (name: TokenSecret) => {
  const secret = process.env[name];

  if (!secret || secret.length < TOKEN_SECRET_MIN_LENGTH) {
    throw new UserServiceError(
      `${name} должен содержать не менее ${TOKEN_SECRET_MIN_LENGTH} символов`,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  return new TextEncoder().encode(secret);
};

class JwtTokenService implements TokenService {
  createAccessToken(user: User) {
    return new SignJWT({ role: user.role, type: "access" })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(user.id)
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(getTokenSecret(TokenSecret.ACCESS_TOKEN));
  }

  createRefreshToken(user: User) {
    return new SignJWT({ type: "refresh" })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(user.id)
      .setIssuedAt()
      .setExpirationTime("30d")
      .sign(getTokenSecret(TokenSecret.REFRESH_TOKEN));
  }

  async verifyAccessToken(token: string) {
    try {
      const { payload } = await jwtVerify(
        token,
        getTokenSecret(TokenSecret.ACCESS_TOKEN),
        { algorithms: ["HS256"] },
      );

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
      const { payload } = await jwtVerify(
        token,
        getTokenSecret(TokenSecret.REFRESH_TOKEN),
        { algorithms: ["HS256"] },
      );

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
    return bcrypt.hash(password, BCRYPT_ROUNDS);
  }

  verifyPassword(password: string, passwordHash: string): Promise<boolean> {
    return bcrypt.compare(password, passwordHash);
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
