import type { AddonDto, AddonPathParams, UpdateAddonAvailabilityRequest } from "@/api-contracts";
import { toAddonDto } from "@/app/api/addons/addon.mapper";
import { addonService } from "@/app/api/addons/addon.service";
import { addonPathParamsSchema, updateAddonAvailabilityRequestSchema } from "@/app/api/addons/addon.validation";
import { ApiResponse } from "@/app/api/common/api-response";
import { validateRequestBody, validateRouteParams } from "@/app/api/common/validate-request";
import { RESTAURANT_PERMISSION } from "@/lib/auth/restaurant-permissions";
import { requireRestaurantPermission } from "../../../require-permission";

type AddonAvailabilityRouteContext = { params: Promise<AddonPathParams> };

export const PATCH = async (request: Request, { params }: AddonAvailabilityRouteContext) => {
  try {
    const [identity, { addonId }, input] = await Promise.all([
      requireRestaurantPermission(request, RESTAURANT_PERMISSION.STOP_LIST_MANAGE),
      params.then((value) => validateRouteParams<AddonPathParams>(value, addonPathParamsSchema)),
      validateRequestBody<UpdateAddonAvailabilityRequest>(request, updateAddonAvailabilityRequestSchema),
    ]);
    return ApiResponse.success<AddonDto>(toAddonDto(
      await addonService.updateAvailability(identity.restaurant.id, addonId, input.isAvailable),
    ));
  } catch (error) {
    return ApiResponse.fromError(error, "Не удалось изменить доступность добавки");
  }
};
