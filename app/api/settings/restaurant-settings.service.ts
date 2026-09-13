import type {
  RestaurantSettingsDto,
  UpdateRestaurantSettingsRequest,
} from "@/api-contracts";
import { ApiError, HttpStatus } from "@/app/api/common/api-response";
import { Prisma } from "@/app/generated/prisma/client";
import { getRestaurantDb } from "@/lib/prisma";

export type RestaurantSettingsRepository = {
  find(restaurantId: string): Promise<RestaurantSettingsDto | null>;
  update(
    restaurantId: string,
    data: UpdateRestaurantSettingsRequest,
  ): Promise<RestaurantSettingsDto>;
};

export class RestaurantSettingsServiceError extends ApiError {
  constructor(message: string, status: HttpStatus) {
    super(message, status);
    this.name = "RestaurantSettingsServiceError";
  }
}

const mapRepositoryError = (error: unknown): never => {
  if (error instanceof RestaurantSettingsServiceError) throw error;

  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2025"
  ) {
    throw new RestaurantSettingsServiceError(
      "Ресторан не найден",
      HttpStatus.NOT_FOUND,
    );
  }

  throw error;
};

export class RestaurantSettingsService {
  constructor(private readonly repository: RestaurantSettingsRepository) {}

  async get(restaurantId: string): Promise<RestaurantSettingsDto> {
    const settings = await this.repository.find(restaurantId);

    if (!settings) {
      throw new RestaurantSettingsServiceError(
        "Ресторан не найден",
        HttpStatus.NOT_FOUND,
      );
    }

    return settings;
  }

  async update(
    restaurantId: string,
    input: UpdateRestaurantSettingsRequest,
  ): Promise<RestaurantSettingsDto> {
    try {
      return await this.repository.update(restaurantId, input);
    } catch (error) {
      return mapRepositoryError(error);
    }
  }
}

const restaurantSettingsRepository: RestaurantSettingsRepository = {
  find: async (restaurantId) => {
    const db = getRestaurantDb(restaurantId);
    return db.restaurant.findUnique({
      where: { id: restaurantId },
      select: { deliveryPrice: true },
    });
  },
  update: async (restaurantId, data) => {
    const db = getRestaurantDb(restaurantId);
    return db.restaurant.update({
      where: { id: restaurantId },
      data,
      select: { deliveryPrice: true },
    });
  },
};

export const restaurantSettingsService = new RestaurantSettingsService(
  restaurantSettingsRepository,
);
