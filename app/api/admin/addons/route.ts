import type { AddonDto, AddonListResponse, CreateAddonRequest, ResolvedSearchPaginationQuery } from "@/api-contracts";
import { toAddonDto } from "@/app/api/addons/addon.mapper";
import { addonService } from "@/app/api/addons/addon.service";
import { addonListQuerySchema, createAddonRequestSchema } from "@/app/api/addons/addon.validation";
import { ApiResponse, HttpStatus } from "@/app/api/common/api-response";
import { createPaginationMeta } from "@/app/api/common/list-query";
import { validateRequestBody, validateRequestData } from "@/app/api/common/validate-request";
import { RESTAURANT_PERMISSION } from "@/lib/auth/restaurant-permissions";
import { requireRestaurantPermission } from "../require-permission";

export const GET = async (request: Request) => {
  try {
    const [identity, query] = await Promise.all([
      requireRestaurantPermission(request, RESTAURANT_PERMISSION.MENU_READ),
      validateRequestData<ResolvedSearchPaginationQuery>(
        Object.fromEntries(new URL(request.url).searchParams), addonListQuerySchema,
      ),
    ]);
    const { items, total } = await addonService.getPage(identity.restaurant.id, query);
    return ApiResponse.success<AddonListResponse>({
      items: items.map(toAddonDto),
      pagination: createPaginationMeta({ page: query.page, limit: query.limit, total }),
    });
  } catch (error) {
    return ApiResponse.fromError(error, "Не удалось получить добавки");
  }
};

export const POST = async (request: Request) => {
  try {
    const [identity, input] = await Promise.all([
      requireRestaurantPermission(request, RESTAURANT_PERMISSION.MENU_MANAGE),
      validateRequestBody<CreateAddonRequest>(request, createAddonRequestSchema),
    ]);
    const addon = await addonService.create(identity.restaurant.id, input);
    return ApiResponse.success<AddonDto>(toAddonDto(addon), HttpStatus.CREATED);
  } catch (error) {
    return ApiResponse.fromError(error, "Не удалось создать добавку");
  }
};
