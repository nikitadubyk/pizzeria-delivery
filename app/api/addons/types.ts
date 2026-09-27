import type {
  CreateAddonRequest,
  ResolvedSearchPaginationQuery,
  UpdateAddonRequest,
} from "@/api-contracts";
import type { Addon } from "@/app/generated/prisma/client";

export type AddonPage = { items: Addon[]; total: number };

export interface AddonRepository {
  findPage(
    restaurantId: string,
    query: ResolvedSearchPaginationQuery
  ): Promise<AddonPage>;
  findOptions(restaurantId: string): Promise<Addon[]>;
  findById(restaurantId: string, addonId: string): Promise<Addon | null>;
  create(restaurantId: string, data: CreateAddonRequest): Promise<Addon>;
  update(
    restaurantId: string,
    addonId: string,
    data: UpdateAddonRequest
  ): Promise<Addon>;
  updateAvailability(
    restaurantId: string,
    addonId: string,
    isAvailable: boolean
  ): Promise<Addon>;
  delete(restaurantId: string, addonId: string): Promise<Addon>;
}
