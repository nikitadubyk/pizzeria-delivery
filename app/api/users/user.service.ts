import type {
  SuperAdminLoginRequest,
  SuperAdminLoginResponse,
  SuperAdminRefreshRequest,
  SuperAdminRefreshResponse,
  SuperAdminUserDto,
} from "@/api-contracts";
import {
  BCRYPT_ROUNDS,
  TokenSecret,
  TOKEN_SECRET_MIN_LENGTH,
} from "@/app/api/users/config";
import { toSuperAdminUserDto } from "@/app/api/users/user.mapper";
import type { TokenService, UserRepository } from "@/app/api/users/types";
import type { User } from "@/app/generated/prisma/client";
import { ApiError, HttpStatus } from "@/app/api/common/api-response";
import { systemDb } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { jwtVerify, SignJWT } from "jose";

export type { TokenService, UserRepository } from "@/app/api/users/types";

export class UserServiceError extends ApiError {
  constructor(message: string, status: HttpStatus) {
    super(message, status);
    this.name = "UserServiceError";
  }
}

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
};

export const userService = new UserService(
  userRepository,
  new JwtTokenService(),
);
