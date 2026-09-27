import type {
  CreateIngredientRequest,
  ResolvedSearchPaginationQuery,
  UpdateIngredientRequest,
} from "@/api-contracts";
import { ApiError, HttpStatus } from "@/app/api/common/api-response";
import { Prisma, type Ingredient } from "@/app/generated/prisma/client";
import { getRestaurantDb } from "@/lib/prisma";

import type { IngredientPage, IngredientRepository } from "./types";

export type { IngredientRepository } from "./types";

export class IngredientServiceError extends ApiError {
  constructor(message: string, status: HttpStatus) {
    super(message, status);
    this.name = "IngredientServiceError";
  }
}

const mapRepositoryError = (error: unknown): never => {
  if (error instanceof IngredientServiceError) throw error;

  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2025"
  ) {
    throw new IngredientServiceError(
      "Ингредиент не найден",
      HttpStatus.NOT_FOUND
    );
  }

  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2003"
  ) {
    throw new IngredientServiceError(
      "Нельзя удалить ингредиент, пока он используется в продуктах",
      HttpStatus.CONFLICT
    );
  }

  throw error;
};

export class IngredientService {
  constructor(private readonly repository: IngredientRepository) {}

  getPage(
    restaurantId: string,
    query: ResolvedSearchPaginationQuery
  ): Promise<IngredientPage> {
    return this.repository.findPage(restaurantId, query);
  }

  getOptions(restaurantId: string): Promise<Ingredient[]> {
    return this.repository.findOptions(restaurantId);
  }

  async getById(
    restaurantId: string,
    ingredientId: string
  ): Promise<Ingredient> {
    const ingredient = await this.repository.findById(
      restaurantId,
      ingredientId
    );

    if (!ingredient) {
      throw new IngredientServiceError(
        "Ингредиент не найден",
        HttpStatus.NOT_FOUND
      );
    }

    return ingredient;
  }

  async create(
    restaurantId: string,
    input: CreateIngredientRequest
  ): Promise<Ingredient> {
    try {
      return await this.repository.create(restaurantId, input);
    } catch (error) {
      return mapRepositoryError(error);
    }
  }

  async update(
    restaurantId: string,
    ingredientId: string,
    input: UpdateIngredientRequest
  ): Promise<Ingredient> {
    try {
      return await this.repository.update(restaurantId, ingredientId, input);
    } catch (error) {
      return mapRepositoryError(error);
    }
  }

  async delete(
    restaurantId: string,
    ingredientId: string
  ): Promise<Ingredient> {
    try {
      return await this.repository.delete(restaurantId, ingredientId);
    } catch (error) {
      return mapRepositoryError(error);
    }
  }
}

const ingredientRepository: IngredientRepository = {
  findPage: async (restaurantId, { page, limit, search }) => {
    const db = getRestaurantDb(restaurantId);
    const where = search
      ? { name: { contains: search, mode: "insensitive" as const } }
      : {};
    const [items, total] = await db.$transaction([
      db.ingredient.findMany({
        where,
        orderBy: [{ name: "asc" }, { id: "asc" }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.ingredient.count({ where }),
    ]);

    return { items, total };
  },
  findOptions: async (restaurantId) => {
    const db = getRestaurantDb(restaurantId);
    return db.ingredient.findMany({
      orderBy: [{ name: "asc" }, { id: "asc" }],
    });
  },
  findById: async (restaurantId, ingredientId) => {
    const db = getRestaurantDb(restaurantId);
    return db.ingredient.findUnique({ where: { id: ingredientId } });
  },
  create: async (restaurantId, data) => {
    const db = getRestaurantDb(restaurantId);
    return db.ingredient.create({ data: { ...data, restaurantId } });
  },
  update: async (restaurantId, ingredientId, data) => {
    const db = getRestaurantDb(restaurantId);
    return db.ingredient.update({ where: { id: ingredientId }, data });
  },
  delete: async (restaurantId, ingredientId) => {
    const db = getRestaurantDb(restaurantId);
    return db.ingredient.delete({ where: { id: ingredientId } });
  },
};

export const ingredientService = new IngredientService(ingredientRepository);
