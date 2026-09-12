import type {
  CreateProductRequest,
  UpdateProductRequest,
} from "@/api-contracts";
import { ApiError, HttpStatus } from "@/app/api/common/api-response";
import { Prisma } from "@/app/generated/prisma/client";
import { getRestaurantDb } from "@/lib/prisma";

import { productImageStorage } from "./product-image.storage";
import type {
  ProductImageStorage,
  ProductPage,
  ProductRepository,
  ProductWithCategory,
  ResolvedProductListQuery,
  StoredProductImage,
} from "./types";

export type { ProductImageStorage, ProductRepository } from "./types";

export class ProductServiceError extends ApiError {
  constructor(message: string, status: HttpStatus) {
    super(message, status);
    this.name = "ProductServiceError";
  }
}

const mapRepositoryError = (error: unknown): never => {
  if (error instanceof ProductServiceError || error instanceof ApiError) {
    throw error;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2025") {
      throw new ProductServiceError("Продукт не найден", HttpStatus.NOT_FOUND);
    }

    if (error.code === "P2003") {
      throw new ProductServiceError(
        "Категория продукта не найдена",
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  throw error;
};

export class ProductService {
  constructor(
    private readonly repository: ProductRepository,
    private readonly imageStorage: ProductImageStorage,
  ) {}

  getPage(
    restaurantId: string,
    query: ResolvedProductListQuery,
  ): Promise<ProductPage> {
    return this.repository.findPage(restaurantId, query);
  }

  async getById(
    restaurantId: string,
    productId: string,
  ): Promise<ProductWithCategory> {
    const product = await this.repository.findById(restaurantId, productId);
    if (!product) {
      throw new ProductServiceError("Продукт не найден", HttpStatus.NOT_FOUND);
    }

    return product;
  }

  async create(
    restaurantId: string,
    input: CreateProductRequest,
  ): Promise<ProductWithCategory> {
    await this.assertCategoryExists(restaurantId, input.categoryId);

    try {
      return await this.repository.create(restaurantId, input);
    } catch (error) {
      return mapRepositoryError(error);
    }
  }

  async update(
    restaurantId: string,
    productId: string,
    input: UpdateProductRequest,
  ): Promise<ProductWithCategory> {
    await this.getById(restaurantId, productId);
    if (input.categoryId !== undefined) {
      await this.assertCategoryExists(restaurantId, input.categoryId);
    }

    try {
      return await this.repository.update(restaurantId, productId, input);
    } catch (error) {
      return mapRepositoryError(error);
    }
  }

  async attachUploadedImage(
    restaurantId: string,
    productId: string,
    image: StoredProductImage,
  ): Promise<ProductWithCategory> {
    let current: ProductWithCategory;
    try {
      current = await this.getById(restaurantId, productId);
    } catch (error) {
      await this.deleteImageQuietly(image.key);
      return mapRepositoryError(error);
    }

    try {
      const product = await this.repository.update(restaurantId, productId, {
        imageUrl: image.url,
        imageKey: image.key,
      });
      if (current.imageKey && current.imageKey !== image.key) {
        await this.deleteImageQuietly(current.imageKey);
      }
      return product;
    } catch (error) {
      await this.deleteImageQuietly(image.key);
      return mapRepositoryError(error);
    }
  }

  async removeImage(
    restaurantId: string,
    productId: string,
  ): Promise<ProductWithCategory> {
    const current = await this.getById(restaurantId, productId);
    if (!current.imageUrl && !current.imageKey) return current;

    try {
      const product = await this.repository.update(restaurantId, productId, {
        imageUrl: null,
        imageKey: null,
      });
      if (current.imageKey) await this.deleteImageQuietly(current.imageKey);
      return product;
    } catch (error) {
      return mapRepositoryError(error);
    }
  }

  async delete(
    restaurantId: string,
    productId: string,
  ): Promise<ProductWithCategory> {
    try {
      const product = await this.repository.delete(restaurantId, productId);
      if (product.imageKey) await this.deleteImageQuietly(product.imageKey);
      return product;
    } catch (error) {
      return mapRepositoryError(error);
    }
  }

  private async assertCategoryExists(
    restaurantId: string,
    categoryId: string,
  ): Promise<void> {
    if (!(await this.repository.categoryExists(restaurantId, categoryId))) {
      throw new ProductServiceError(
        "Категория продукта не найдена",
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async deleteImageQuietly(key: string): Promise<void> {
    try {
      await this.imageStorage.delete(key);
    } catch (error) {
      // The database is already consistent. Log cleanup failures for retry by a
      // future maintenance job instead of making a successful mutation appear failed.
      console.error(`Unable to delete UploadThing file ${key}`, error);
    }
  }
}

const productRepository: ProductRepository = {
  findPage: async (
    restaurantId,
    { page, limit, search, categoryId, isPublished },
  ) => {
    const db = getRestaurantDb(restaurantId);
    const where: Prisma.ProductWhereInput = {
      categoryId,
      isPublished,
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
              {
                baseComposition: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {}),
    };
    const [items, total] = await db.$transaction([
      db.product.findMany({
        where,
        include: { category: { select: { id: true, name: true } } },
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.product.count({ where }),
    ]);

    return { items, total };
  },
  findById: async (restaurantId, productId) => {
    const db = getRestaurantDb(restaurantId);
    return db.product.findUnique({
      where: { id: productId },
      include: { category: { select: { id: true, name: true } } },
    });
  },
  categoryExists: async (restaurantId, categoryId) => {
    const db = getRestaurantDb(restaurantId);
    return Boolean(
      await db.category.findUnique({
        where: { id: categoryId },
        select: { id: true },
      }),
    );
  },
  create: async (restaurantId, data) => {
    const db = getRestaurantDb(restaurantId);
    return db.product.create({
      data: { ...data, restaurantId },
      include: { category: { select: { id: true, name: true } } },
    });
  },
  update: async (restaurantId, productId, data) => {
    const db = getRestaurantDb(restaurantId);
    return db.product.update({
      where: { id: productId },
      data,
      include: { category: { select: { id: true, name: true } } },
    });
  },
  delete: async (restaurantId, productId) => {
    const db = getRestaurantDb(restaurantId);
    return db.product.delete({
      where: { id: productId },
      include: { category: { select: { id: true, name: true } } },
    });
  },
};

export const productService = new ProductService(
  productRepository,
  productImageStorage,
);
