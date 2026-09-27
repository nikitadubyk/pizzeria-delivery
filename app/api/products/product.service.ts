import type {
  CreateProductRequest,
  UpdateProductRequest,
} from "@/api-contracts";
import { ApiError, HttpStatus } from "@/app/api/common/api-response";
import { Prisma } from "@/app/generated/prisma/client";
import { getRestaurantDb } from "@/lib/prisma";

import { productImageStorage } from "./product-image.storage";
import {
  productVariantService,
  type ProductVariantService,
} from "./product-variant.service";
import type {
  ProductImageStorage,
  ProductPage,
  ProductRepository,
  ProductWithCategory,
  ProductAddonWrite,
  ProductRemovableIngredientWrite,
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
        "Категория, ингредиент или добавка продукта не найдены",
        HttpStatus.BAD_REQUEST
      );
    }
  }

  throw error;
};

export class ProductService {
  constructor(
    private readonly repository: ProductRepository,
    private readonly imageStorage: ProductImageStorage,
    private readonly variantService: ProductVariantService = productVariantService
  ) {}

  getPage(
    restaurantId: string,
    query: ResolvedProductListQuery
  ): Promise<ProductPage> {
    return this.repository.findPage(restaurantId, query);
  }

  async getById(
    restaurantId: string,
    productId: string
  ): Promise<ProductWithCategory> {
    const product = await this.repository.findById(restaurantId, productId);
    if (!product) {
      throw new ProductServiceError("Продукт не найден", HttpStatus.NOT_FOUND);
    }

    return product;
  }

  async create(
    restaurantId: string,
    input: CreateProductRequest
  ): Promise<ProductWithCategory> {
    await this.assertCategoryExists(restaurantId, input.categoryId);
    const { variants, removableIngredientIds, addonIds, ...productData } =
      input;
    const removableIngredients = this.prepareRemovableIngredients(
      removableIngredientIds ?? []
    );
    const addons = this.prepareAddons(addonIds ?? []);
    await Promise.all([
      this.assertIngredientsExist(restaurantId, removableIngredientIds ?? []),
      this.assertAddonsExist(restaurantId, addonIds ?? []),
    ]);

    try {
      return await this.repository.create(
        restaurantId,
        productData,
        this.variantService.prepareForCreate(variants),
        removableIngredients,
        addons
      );
    } catch (error) {
      return mapRepositoryError(error);
    }
  }

  async update(
    restaurantId: string,
    productId: string,
    input: UpdateProductRequest
  ): Promise<ProductWithCategory> {
    await this.getById(restaurantId, productId);
    if (input.categoryId !== undefined) {
      await this.assertCategoryExists(restaurantId, input.categoryId);
    }

    const { variants, removableIngredientIds, addonIds, ...productData } =
      input;
    const removableIngredients =
      removableIngredientIds === undefined
        ? undefined
        : this.prepareRemovableIngredients(removableIngredientIds);
    const addons =
      addonIds === undefined ? undefined : this.prepareAddons(addonIds);
    await Promise.all([
      this.assertIngredientsExist(restaurantId, removableIngredientIds ?? []),
      this.assertAddonsExist(restaurantId, addonIds ?? []),
    ]);

    try {
      return await this.repository.update(
        restaurantId,
        productId,
        productData,
        variants ? this.variantService.prepareForUpdate(variants) : undefined,
        removableIngredients,
        addons
      );
    } catch (error) {
      return mapRepositoryError(error);
    }
  }

  async updateAvailability(
    restaurantId: string,
    productId: string,
    isAvailable: boolean
  ): Promise<ProductWithCategory> {
    try {
      return await this.repository.updateAvailability(
        restaurantId,
        productId,
        isAvailable
      );
    } catch (error) {
      return mapRepositoryError(error);
    }
  }

  async attachUploadedImage(
    restaurantId: string,
    productId: string,
    image: StoredProductImage
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
    productId: string
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
    productId: string
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
    categoryId: string
  ): Promise<void> {
    if (!(await this.repository.categoryExists(restaurantId, categoryId))) {
      throw new ProductServiceError(
        "Категория продукта не найдена",
        HttpStatus.BAD_REQUEST
      );
    }
  }

  private async assertIngredientsExist(
    restaurantId: string,
    ingredientIds: readonly string[]
  ): Promise<void> {
    if (ingredientIds.length === 0) return;

    if (
      (await this.repository.ingredientsCount(restaurantId, ingredientIds)) !==
      ingredientIds.length
    ) {
      throw new ProductServiceError(
        "Один или несколько ингредиентов не найдены",
        HttpStatus.BAD_REQUEST
      );
    }
  }

  private async assertAddonsExist(
    restaurantId: string,
    addonIds: readonly string[]
  ): Promise<void> {
    if (addonIds.length === 0) return;

    if (
      (await this.repository.addonsCount(restaurantId, addonIds)) !==
      addonIds.length
    ) {
      throw new ProductServiceError(
        "Одна или несколько добавок не найдены",
        HttpStatus.BAD_REQUEST
      );
    }
  }

  private prepareRemovableIngredients(
    ingredientIds: readonly string[]
  ): ProductRemovableIngredientWrite[] {
    return ingredientIds.map((ingredientId) => ({ ingredientId }));
  }

  private prepareAddons(addonIds: readonly string[]): ProductAddonWrite[] {
    return addonIds.map((addonId) => ({ addonId }));
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
    { page, limit, search, categoryId, isPublished }
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
        include: {
          category: { select: { id: true, name: true } },
          variants: { orderBy: [{ sortOrder: "asc" }, { id: "asc" }] },
          removableIngredients: {
            include: { ingredient: { select: { id: true, name: true } } },
            orderBy: [{ id: "asc" }],
          },
          addons: {
            include: {
              addon: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  isAvailable: true,
                },
              },
            },
            orderBy: [{ id: "asc" }],
          },
        },
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
      include: {
        category: { select: { id: true, name: true } },
        variants: { orderBy: [{ sortOrder: "asc" }, { id: "asc" }] },
        removableIngredients: {
          include: { ingredient: { select: { id: true, name: true } } },
          orderBy: [{ id: "asc" }],
        },
        addons: {
          include: {
            addon: {
              select: {
                id: true,
                name: true,
                price: true,
                isAvailable: true,
              },
            },
          },
          orderBy: [{ id: "asc" }],
        },
      },
    });
  },
  categoryExists: async (restaurantId, categoryId) => {
    const db = getRestaurantDb(restaurantId);
    return Boolean(
      await db.category.findUnique({
        where: { id: categoryId },
        select: { id: true },
      })
    );
  },
  ingredientsCount: async (restaurantId, ingredientIds) =>
    getRestaurantDb(restaurantId).ingredient.count({
      where: { id: { in: [...ingredientIds] } },
    }),
  addonsCount: async (restaurantId, addonIds) =>
    getRestaurantDb(restaurantId).addon.count({
      where: { id: { in: [...addonIds] } },
    }),
  create: async (
    restaurantId,
    data,
    variants,
    removableIngredients,
    addons
  ) => {
    const db = getRestaurantDb(restaurantId);
    return db.product.create({
      data: {
        ...data,
        restaurantId,
        variants: {
          create: productVariantService.createForNewProduct(variants),
        },
        removableIngredients: {
          create: [...removableIngredients],
        },
        addons: {
          create: [...addons],
        },
      },
      include: {
        category: { select: { id: true, name: true } },
        variants: { orderBy: [{ sortOrder: "asc" }, { id: "asc" }] },
        removableIngredients: {
          include: { ingredient: { select: { id: true, name: true } } },
          orderBy: [{ id: "asc" }],
        },
        addons: {
          include: {
            addon: {
              select: {
                id: true,
                name: true,
                price: true,
                isAvailable: true,
              },
            },
          },
          orderBy: [{ id: "asc" }],
        },
      },
    });
  },
  update: async (
    restaurantId,
    productId,
    data,
    variants,
    removableIngredients,
    addons
  ) => {
    const db = getRestaurantDb(restaurantId);
    const { categoryId, ...productData } = data;
    const existingVariants = variants?.filter((variant) => variant.id) ?? [];
    const newVariants = variants?.filter((variant) => !variant.id) ?? [];
    const existingVariantIds = existingVariants.map((variant) => variant.id!);

    return db.product.update({
      where: { id: productId },
      data: {
        ...productData,
        ...(categoryId
          ? {
              category: {
                connect: {
                  restaurantId_id: { restaurantId, id: categoryId },
                },
              },
            }
          : {}),
        ...(variants
          ? {
              variants: {
                deleteMany:
                  existingVariantIds.length > 0
                    ? { id: { notIn: existingVariantIds } }
                    : {},
                update: existingVariants.map(({ id, ...variant }) => ({
                  where: { id },
                  data: variant,
                })),
                create: productVariantService.createForExistingProduct(
                  restaurantId,
                  newVariants
                ),
              },
            }
          : {}),
        ...(removableIngredients
          ? {
              removableIngredients: {
                deleteMany: {},
                create: [...removableIngredients],
              },
            }
          : {}),
        ...(addons
          ? {
              addons: {
                deleteMany: {},
                create: [...addons],
              },
            }
          : {}),
      },
      include: {
        category: { select: { id: true, name: true } },
        variants: { orderBy: [{ sortOrder: "asc" }, { id: "asc" }] },
        removableIngredients: {
          include: { ingredient: { select: { id: true, name: true } } },
          orderBy: [{ id: "asc" }],
        },
        addons: {
          include: {
            addon: {
              select: {
                id: true,
                name: true,
                price: true,
                isAvailable: true,
              },
            },
          },
          orderBy: [{ id: "asc" }],
        },
      },
    });
  },
  updateAvailability: async (restaurantId, productId, isAvailable) => {
    const db = getRestaurantDb(restaurantId);
    return db.product.update({
      where: { id: productId },
      data: { isAvailable },
      include: {
        category: { select: { id: true, name: true } },
        variants: { orderBy: [{ sortOrder: "asc" }, { id: "asc" }] },
        removableIngredients: {
          include: { ingredient: { select: { id: true, name: true } } },
          orderBy: [{ id: "asc" }],
        },
        addons: {
          include: {
            addon: {
              select: {
                id: true,
                name: true,
                price: true,
                isAvailable: true,
              },
            },
          },
          orderBy: [{ id: "asc" }],
        },
      },
    });
  },
  delete: async (restaurantId, productId) => {
    const db = getRestaurantDb(restaurantId);
    return db.product.delete({
      where: { id: productId },
      include: {
        category: { select: { id: true, name: true } },
        variants: { orderBy: [{ sortOrder: "asc" }, { id: "asc" }] },
        removableIngredients: {
          include: { ingredient: { select: { id: true, name: true } } },
          orderBy: [{ id: "asc" }],
        },
        addons: {
          include: {
            addon: {
              select: {
                id: true,
                name: true,
                price: true,
                isAvailable: true,
              },
            },
          },
          orderBy: [{ id: "asc" }],
        },
      },
    });
  },
};

export const productService = new ProductService(
  productRepository,
  productImageStorage
);
