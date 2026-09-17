import type { AddonDto, AddonPathParams, UpdateAddonRequest } from "@/api-contracts";
import { toAddonDto } from "@/app/api/addons/addon.mapper";
import { addonService } from "@/app/api/addons/addon.service";
import { addonPathParamsSchema, updateAddonRequestSchema } from "@/app/api/addons/addon.validation";
import { ApiResponse } from "@/app/api/common/api-response";
import { validateRequestBody, validateRouteParams } from "@/app/api/common/validate-request";
import { RESTAURANT_PERMISSION } from "@/lib/auth/restaurant-permissions";
import { requireRestaurantPermission } from "../../require-permission";

type AddonRouteContext = { params: Promise<AddonPathParams> };

export const GET = async (request: Request, { params }: AddonRouteContext) => {
  try {
    const [identity, { addonId }] = await Promise.all([
      requireRestaurantPermission(request, RESTAURANT_PERMISSION.MENU_READ),
      params.then((value) => validateRouteParams<AddonPathParams>(value, addonPathParamsSchema)),
    ]);
    return ApiResponse.success<AddonDto>(toAddonDto(await addonService.getById(identity.restaurant.id, addonId)));
  } catch (error) {
    return ApiResponse.fromError(error, "Не удалось получить добавку");
  }
};

export const PATCH = async (request: Request, { params }: AddonRouteContext) => {
  try {
    const [identity, { addonId }, input] = await Promise.all([
      requireRestaurantPermission(request, RESTAURANT_PERMISSION.MENU_MANAGE),
      params.then((value) => validateRouteParams<AddonPathParams>(value, addonPathParamsSchema)),
      validateRequestBody<UpdateAddonRequest>(request, updateAddonRequestSchema),
    ]);
    return ApiResponse.success<AddonDto>(toAddonDto(await addonService.update(identity.restaurant.id, addonId, input)));
  } catch (error) {
    return ApiResponse.fromError(error, "Не удалось обновить добавку");
  }
};

export const DELETE = async (request: Request, { params }: AddonRouteContext) => {
  try {
    const [identity, { addonId }] = await Promise.all([
      requireRestaurantPermission(request, RESTAURANT_PERMISSION.MENU_MANAGE),
      params.then((value) => validateRouteParams<AddonPathParams>(value, addonPathParamsSchema)),
    ]);
    return ApiResponse.success<AddonDto>(toAddonDto(await addonService.delete(identity.restaurant.id, addonId)));
  } catch (error) {
    return ApiResponse.fromError(error, "Не удалось удалить добавку");
  }
};
