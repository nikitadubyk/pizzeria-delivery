import type { CreateAddonRequest, ResolvedSearchPaginationQuery, UpdateAddonRequest } from "@/api-contracts";
import { ApiError, HttpStatus } from "@/app/api/common/api-response";
import { Prisma, type Addon } from "@/app/generated/prisma/client";
import { getRestaurantDb } from "@/lib/prisma";
import type { AddonPage, AddonRepository } from "./types";

export type { AddonRepository } from "./types";

export class AddonServiceError extends ApiError {
  constructor(message: string, status: HttpStatus) {
    super(message, status);
    this.name = "AddonServiceError";
  }
}

function mapRepositoryError(error: unknown): never {
  if (error instanceof AddonServiceError) throw error;
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2025") {
      throw new AddonServiceError("Добавка не найдена", HttpStatus.NOT_FOUND);
    }
    if (error.code === "P2003") {
      throw new AddonServiceError("Добавка используется и не может быть удалена", HttpStatus.CONFLICT);
    }
  }
  throw error;
}

export class AddonService {
  constructor(private readonly repository: AddonRepository) {}

  getPage(restaurantId: string, query: ResolvedSearchPaginationQuery): Promise<AddonPage> {
    return this.repository.findPage(restaurantId, query);
  }

  async getById(restaurantId: string, addonId: string): Promise<Addon> {
    const addon = await this.repository.findById(restaurantId, addonId);
    if (!addon) throw new AddonServiceError("Добавка не найдена", HttpStatus.NOT_FOUND);
    return addon;
  }

  async create(restaurantId: string, data: CreateAddonRequest): Promise<Addon> {
    try { return await this.repository.create(restaurantId, data); }
    catch (error) { return mapRepositoryError(error); }
  }

  async update(restaurantId: string, addonId: string, data: UpdateAddonRequest): Promise<Addon> {
    try { return await this.repository.update(restaurantId, addonId, data); }
    catch (error) { return mapRepositoryError(error); }
  }

  async updateAvailability(restaurantId: string, addonId: string, isAvailable: boolean): Promise<Addon> {
    try { return await this.repository.updateAvailability(restaurantId, addonId, isAvailable); }
    catch (error) { return mapRepositoryError(error); }
  }

  async delete(restaurantId: string, addonId: string): Promise<Addon> {
    try { return await this.repository.delete(restaurantId, addonId); }
    catch (error) { return mapRepositoryError(error); }
  }
}

const addonRepository: AddonRepository = {
  findPage: async (restaurantId, { page, limit, search }) => {
    const db = getRestaurantDb(restaurantId);
    const where = search ? { name: { contains: search, mode: "insensitive" as const } } : {};
    const [items, total] = await db.$transaction([
      db.addon.findMany({ where, orderBy: [{ name: "asc" }, { id: "asc" }], skip: (page - 1) * limit, take: limit }),
      db.addon.count({ where }),
    ]);
    return { items, total };
  },
  findById: (restaurantId, addonId) => getRestaurantDb(restaurantId).addon.findUnique({ where: { id: addonId } }),
  create: (restaurantId, data) => getRestaurantDb(restaurantId).addon.create({ data: { ...data, restaurantId } }),
  update: (restaurantId, addonId, data) => getRestaurantDb(restaurantId).addon.update({ where: { id: addonId }, data }),
  updateAvailability: (restaurantId, addonId, isAvailable) => getRestaurantDb(restaurantId).addon.update({ where: { id: addonId }, data: { isAvailable } }),
  delete: (restaurantId, addonId) => getRestaurantDb(restaurantId).addon.delete({ where: { id: addonId } }),
};

export const addonService = new AddonService(addonRepository);
