import type {
  CategoryListQuery,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "@/api-contracts";
import { ApiError, HttpStatus } from "@/app/api/common/api-response";
import { Prisma, type Category } from "@/app/generated/prisma/client";
import type {
  CategoryPage,
  CategoryRepository,
} from "@/app/api/categories/types";
import { getRestaurantDb } from "@/lib/prisma";

export type { CategoryRepository } from "@/app/api/categories/types";

export class CategoryServiceError extends ApiError {
  constructor(message: string, status: HttpStatus) {
    super(message, status);
    this.name = "CategoryServiceError";
  }
}

const mapRepositoryError = (error: unknown): never => {
  if (error instanceof CategoryServiceError) throw error;

  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2025"
  ) {
    throw new CategoryServiceError(
      "Категория не найдена",
      HttpStatus.NOT_FOUND,
    );
  }

  throw error;
};

export class CategoryService {
  constructor(private readonly repository: CategoryRepository) {}

  getPage(
    restaurantId: string,
    pagination: Required<CategoryListQuery>,
  ): Promise<CategoryPage> {
    return this.repository.findPage(restaurantId, pagination);
  }

  async getById(restaurantId: string, categoryId: string): Promise<Category> {
    const category = await this.repository.findById(restaurantId, categoryId);

    if (!category) {
      throw new CategoryServiceError(
        "Категория не найдена",
        HttpStatus.NOT_FOUND,
      );
    }

    return category;
  }

  async create(
    restaurantId: string,
    input: CreateCategoryRequest,
  ): Promise<Category> {
    try {
      return await this.repository.create(restaurantId, input);
    } catch (error) {
      return mapRepositoryError(error);
    }
  }

  async update(
    restaurantId: string,
    categoryId: string,
    input: UpdateCategoryRequest,
  ): Promise<Category> {
    try {
      return await this.repository.update(restaurantId, categoryId, input);
    } catch (error) {
      return mapRepositoryError(error);
    }
  }

  async delete(restaurantId: string, categoryId: string): Promise<Category> {
    try {
      return await this.repository.delete(restaurantId, categoryId);
    } catch (error) {
      return mapRepositoryError(error);
    }
  }
}

const categoryRepository: CategoryRepository = {
  findPage: async (restaurantId, { page, limit }) => {
    const db = getRestaurantDb(restaurantId);
    const [items, total] = await db.$transaction([
      db.category.findMany({
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.category.count(),
    ]);

    return { items, total };
  },
  findById: async (restaurantId, categoryId) => {
    const db = getRestaurantDb(restaurantId);
    return db.category.findUnique({ where: { id: categoryId } });
  },
  create: async (restaurantId, data) => {
    const db = getRestaurantDb(restaurantId);
    return db.category.create({ data: { ...data, restaurantId } });
  },
  update: async (restaurantId, categoryId, data) => {
    const db = getRestaurantDb(restaurantId);
    return db.category.update({ where: { id: categoryId }, data });
  },
  delete: async (restaurantId, categoryId) => {
    const db = getRestaurantDb(restaurantId);
    return db.category.delete({ where: { id: categoryId } });
  },
};

export const categoryService = new CategoryService(categoryRepository);
