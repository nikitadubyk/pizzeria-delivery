import type { User } from "@/app/generated/prisma/client";
import { ApiError, HttpStatus } from "@/app/api/common/api-response";
import { systemDb } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { jwtVerify, SignJWT } from "jose";

const BCRYPT_ROUNDS = 12;
const MIN_PASSWORD_LENGTH = 8;

enum TokenSecret {
  ACCESS_TOKEN = "ACCESS_TOKEN_SECRET",
  REFRESH_TOKEN = "REFRESH_TOKEN_SECRET",
}

type PublicUser = Omit<User, "password">;

export type SuperAdminLoginInput = {
  email: string;
  password: string;
};

export type SuperAdminLoginResult = {
  user: PublicUser;
  accessToken: string;
  refreshToken: string;
};

export type SuperAdminRefreshInput = {
  refreshToken: string;
};

export type SuperAdminRefreshResult = {
  accessToken: string;
  refreshToken: string;
};

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

export class UserServiceError extends ApiError {
  constructor(message: string, status: HttpStatus) {
    super(message, status);
    this.name = "UserServiceError";
  }
}

const getTokenSecret = (name: TokenSecret) => {
  const secret = process.env[name];

  if (!secret || secret.length < 32) {
    throw new UserServiceError(
      `${name} должен содержать не менее 32 символов`,
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

const toPublicUser = (user: User): PublicUser => ({
  id: user.id,
  restaurantId: user.restaurantId,
  phone: user.phone,
  email: user.email,
  name: user.name,
  role: user.role,
  isActive: user.isActive,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export class UserService {
  constructor(
    private readonly repository: UserRepository,
    private readonly tokenService: TokenService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    if (password.length < MIN_PASSWORD_LENGTH) {
      throw new UserServiceError(
        `Пароль должен содержать не менее ${MIN_PASSWORD_LENGTH} символов`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return bcrypt.hash(password, BCRYPT_ROUNDS);
  }

  verifyPassword(password: string, passwordHash: string): Promise<boolean> {
    return bcrypt.compare(password, passwordHash);
  }

  async login(input: SuperAdminLoginInput): Promise<SuperAdminLoginResult> {
    const email = input.email.trim().toLowerCase();
    const user = await this.repository.findSuperAdminByEmail(email);

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
      user: toPublicUser(user),
      accessToken,
      refreshToken,
    };
  }

  async refresh(
    input: SuperAdminRefreshInput,
  ): Promise<SuperAdminRefreshResult> {
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

  async getCurrentSuperAdmin(accessToken: string): Promise<PublicUser> {
    const userId = await this.tokenService.verifyAccessToken(accessToken);
    const user = await this.repository.findSuperAdminById(userId);

    if (!user) {
      throw new UserServiceError(
        "Super admin не найден или заблокирован",
        HttpStatus.UNAUTHORIZED,
      );
    }

    return toPublicUser(user);
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
