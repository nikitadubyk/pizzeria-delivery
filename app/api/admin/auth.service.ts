import { ApiError, HttpStatus } from "@/app/api/common/api-response";
import { errors, type JWTPayload } from "jose";
import type { RestaurantIdentity, RestaurantLoginInput } from "@/api-contracts";
import { TokenSecret } from "@/app/api/users/config";
import { verifyPassword } from "@/lib/auth/crypto";
import { validateRequestData } from "@/app/api/common/validate-request";
import { JwtService } from "@/lib/auth/jwt.service";
import { RESTAURANT_SESSION } from "./auth.config";
import { restaurantAuthRepository } from "./auth.repository";
import { restaurantSessionSchema } from "./auth.validation";
import type {
  RestaurantAuthRepository,
  RestaurantAuthUser,
  AccessibleRestaurantUser,
} from "./auth.types";

const sessionError = (): ApiError =>
  new ApiError("Сессия недействительна. Войдите снова.", HttpStatus.UNAUTHORIZED);

function assertRestaurantAccess(
  user: RestaurantAuthUser | null,
  restaurantId: string,
): asserts user is AccessibleRestaurantUser {
  if (
    !user?.isActive ||
    !user.restaurant ||
    user.restaurantId !== restaurantId ||
    user.restaurant.status !== "ACTIVE" ||
    (user.role !== "OWNER" && user.role !== "EMPLOYEE")
  ) {
    throw sessionError();
  }
}

function toRestaurantIdentity(user: AccessibleRestaurantUser): RestaurantIdentity {
  return {
    id: user.id,
    name: user.name,
    role: user.role,
    restaurant: { id: user.restaurant.id, name: user.restaurant.name },
  };
}

export class RestaurantAuthService {
  constructor(
    private readonly repository: RestaurantAuthRepository,
    private readonly tokens = new JwtService({
      secret: TokenSecret.ACCESS_TOKEN,
      issuer: RESTAURANT_SESSION.issuer,
      audience: RESTAURANT_SESSION.audience,
    }),
  ) {}

  async login(input: RestaurantLoginInput): Promise<string> {
    const candidates = await this.repository.findCandidates(input.login);
    const user = candidates.length === 1 ? candidates[0] : null;
    if (!user?.restaurantId || !(await verifyPassword(input.password, user.password))) {
      throw new ApiError("Неверный email, телефон или пароль", HttpStatus.UNAUTHORIZED);
    }

    assertRestaurantAccess(user, user.restaurantId);
    return this.tokens.sign(
      user.id,
      {
        restaurantId: user.restaurantId,
        version: user.authVersion,
        type: RESTAURANT_SESSION.type,
      },
      `${RESTAURANT_SESSION.seconds}s`,
    );
  }

  async authenticate(token: string): Promise<RestaurantIdentity> {
    let payload: JWTPayload;
    try {
      payload = await this.tokens.verify(token);
    } catch (error) {
      if (error instanceof errors.JOSEError) throw sessionError();
      throw error;
    }
    const session = await validateRequestData(
      payload,
      restaurantSessionSchema,
      HttpStatus.UNAUTHORIZED,
    );

    const user = await this.repository.findUser(session.restaurantId, session.sub);
    assertRestaurantAccess(user, session.restaurantId);
    if (session.version !== user.authVersion) throw sessionError();
    return toRestaurantIdentity(user);
  }
}

export const restaurantAuth = new RestaurantAuthService(restaurantAuthRepository);
