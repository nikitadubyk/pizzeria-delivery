import type {
  RestaurantSettingsDto,
  UpdateRestaurantSettingsRequest,
} from "@/api-contracts";
import { ApiResponse } from "@/app/api/common/api-response";
import { validateRequestBody } from "@/app/api/common/validate-request";
import { restaurantSettingsService } from "@/app/api/settings/restaurant-settings.service";
import { updateRestaurantSettingsRequestSchema } from "@/app/api/settings/restaurant-settings.validation";
import { RESTAURANT_PERMISSION } from "@/lib/auth/restaurant-permissions";

import { requireRestaurantPermission } from "../require-permission";

export async function GET(request: Request) {
  try {
    const identity = await requireRestaurantPermission(
      request,
      RESTAURANT_PERMISSION.SETTINGS_MANAGE,
    );
    const settings = await restaurantSettingsService.get(
      identity.restaurant.id,
    );

    return Response.json(settings satisfies RestaurantSettingsDto, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return ApiResponse.fromError(error, "Не удалось получить настройки");
  }
}

export async function PATCH(request: Request) {
  try {
    const [identity, input] = await Promise.all([
      requireRestaurantPermission(
        request,
        RESTAURANT_PERMISSION.SETTINGS_MANAGE,
      ),
      validateRequestBody<UpdateRestaurantSettingsRequest>(
        request,
        updateRestaurantSettingsRequestSchema,
      ),
    ]);
    const settings = await restaurantSettingsService.update(
      identity.restaurant.id,
      input,
    );

    return ApiResponse.success<RestaurantSettingsDto>(settings);
  } catch (error) {
    return ApiResponse.fromError(error, "Не удалось обновить настройки");
  }
}
