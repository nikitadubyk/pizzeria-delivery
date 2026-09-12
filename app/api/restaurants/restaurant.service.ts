import type {
  CreateRestaurantRequest,
  ResolvedSearchPaginationQuery,
  UpdateRestaurantRequest,
} from "@/api-contracts";
import { ApiError, HttpStatus } from "@/app/api/common/api-response";
import { Prisma, type Restaurant } from "@/app/generated/prisma/client";
import type {
  RestaurantDeletion,
  RestaurantPage,
  RestaurantRepository,
} from "@/app/api/restaurants/types";
import { getSuperAdminDb } from "@/lib/prisma";

import { productImageStorage } from "../products/product-image.storage";
import type { ProductImageStorage } from "../products/types";

export type { RestaurantRepository } from "@/app/api/restaurants/types";

export class RestaurantServiceError extends ApiError {
  constructor(message: string, status: HttpStatus) {
    super(message, status);
    this.name = "RestaurantServiceError";
  }
}

const mapRepositoryError = (error: unknown): never => {
  if (error instanceof RestaurantServiceError) throw error;

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      throw new RestaurantServiceError(
        "Ресторан с таким slug уже существует",
        HttpStatus.CONFLICT,
      );
    }

    if (error.code === "P2025") {
      throw new RestaurantServiceError(
        "Ресторан не найден",
        HttpStatus.NOT_FOUND,
      );
    }
  }

  throw error;
};

export class RestaurantService {
  constructor(
    private readonly repository: RestaurantRepository,
    private readonly imageStorage: Pick<
      ProductImageStorage,
      "deleteMany"
    > = productImageStorage,
  ) {}

  getPage(
    superAdminId: string,
    pagination: ResolvedSearchPaginationQuery,
  ): Promise<RestaurantPage> {
    return this.repository.findPage(superAdminId, pagination);
  }

  async getById(
    superAdminId: string,
    restaurantId: string,
  ): Promise<Restaurant> {
    const restaurant = await this.repository.findById(
      superAdminId,
      restaurantId,
    );

    if (!restaurant) {
      throw new RestaurantServiceError(
        "Ресторан не найден",
        HttpStatus.NOT_FOUND,
      );
    }

    return restaurant;
  }

  async create(
    superAdminId: string,
    input: CreateRestaurantRequest,
  ): Promise<Restaurant> {
    try {
      return await this.repository.create(superAdminId, input);
    } catch (error) {
      return mapRepositoryError(error);
    }
  }

  async update(
    superAdminId: string,
    restaurantId: string,
    input: UpdateRestaurantRequest,
  ): Promise<Restaurant> {
    try {
      return await this.repository.update(superAdminId, restaurantId, input);
    } catch (error) {
      return mapRepositoryError(error);
    }
  }

  async delete(
    superAdminId: string,
    restaurantId: string,
  ): Promise<Restaurant> {
    try {
      const { restaurant, productImageKeys } = await this.repository.delete(
        superAdminId,
        restaurantId,
      );
      await this.imageStorage.deleteMany(productImageKeys);
      return restaurant;
    } catch (error) {
      return mapRepositoryError(error);
    }
  }
}

const restaurantRepository: RestaurantRepository = {
  findPage: async (superAdminId, { page, limit, search }) => {
    const db = await getSuperAdminDb(superAdminId);
    const where: Prisma.RestaurantWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { slug: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};
    const [items, total] = await db.$transaction([
      db.restaurant.findMany({
        where,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.restaurant.count({ where }),
    ]);

    return { items, total };
  },
  findById: async (superAdminId, restaurantId) => {
    const db = await getSuperAdminDb(superAdminId);
    return db.restaurant.findUnique({ where: { id: restaurantId } });
  },
  create: async (superAdminId, data) => {
    const db = await getSuperAdminDb(superAdminId);
    return db.restaurant.create({ data });
  },
  update: async (superAdminId, restaurantId, data) => {
    const db = await getSuperAdminDb(superAdminId);
    return db.restaurant.update({ where: { id: restaurantId }, data });
  },
  delete: async (superAdminId, restaurantId) => {
    const db = await getSuperAdminDb(superAdminId);
    return db.$transaction(async (transaction): Promise<RestaurantDeletion> => {
      const products = await transaction.product.findMany({
        where: { restaurantId },
        select: { imageKey: true },
      });

      await transaction.product.deleteMany({ where: { restaurantId } });
      const restaurant = await transaction.restaurant.delete({
        where: { id: restaurantId },
      });

      return {
        restaurant,
        productImageKeys: products.flatMap(({ imageKey }) =>
          imageKey ? [imageKey] : [],
        ),
      };
    });
  },
};

export const restaurantService = new RestaurantService(restaurantRepository);
