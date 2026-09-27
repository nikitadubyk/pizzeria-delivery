import type { AddonOptionDto } from "@/api-contracts";
import { addonService } from "@/app/api/addons/addon.service";
import { ApiResponse } from "@/app/api/common/api-response";
import { RESTAURANT_PERMISSION } from "@/lib/auth/restaurant-permissions";

import { requireRestaurantPermission } from "../../require-permission";

export const GET = async (request: Request) => {
  try {
    const identity = await requireRestaurantPermission(
      request,
      RESTAURANT_PERMISSION.MENU_READ
    );
    const addons = await addonService.getOptions(identity.restaurant.id);
    const options = addons.map(
      ({ id, name, price, isAvailable }): AddonOptionDto => ({
        id,
        name,
        price,
        isAvailable,
      })
    );

    return ApiResponse.success<AddonOptionDto[]>(options);
  } catch (error) {
    return ApiResponse.fromError(error, "Не удалось получить добавки");
  }
};
