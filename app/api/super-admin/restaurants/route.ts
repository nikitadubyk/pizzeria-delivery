import type {
  CreateRestaurantRequest,
  RestaurantDto,
  RestaurantListQuery,
  RestaurantListResponse,
} from "@/api-contracts";
import { ApiResponse, HttpStatus } from "@/app/api/common/api-response";
import {
  validateRequestBody,
  validateRequestData,
} from "@/app/api/common/validate-request";
import { toRestaurantDto } from "@/app/api/restaurants/restaurant.mapper";
import { restaurantService } from "@/app/api/restaurants/restaurant.service";
import {
  createRestaurantRequestSchema,
  restaurantListQuerySchema,
} from "@/app/api/restaurants/restaurant.validation";
import { getSuperAdminId } from "@/app/api/super-admin/auth";

export const GET = async (request: Request) => {
  try {
    const superAdminId = await getSuperAdminId(request);
    const searchParams = Object.fromEntries(new URL(request.url).searchParams);
    const { page, limit } = await validateRequestData<
      Required<RestaurantListQuery>
    >(searchParams, restaurantListQuerySchema);
    const { items, total } = await restaurantService.getPage(superAdminId, {
      page,
      limit,
    });

    return ApiResponse.success<RestaurantListResponse>({
      items: items.map(toRestaurantDto),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return ApiResponse.fromError(error, "Не удалось получить рестораны");
  }
};

export const POST = async (request: Request) => {
  try {
    const superAdminId = await getSuperAdminId(request);
    const input = await validateRequestBody<CreateRestaurantRequest>(
      request,
      createRestaurantRequestSchema,
    );
    const restaurant = await restaurantService.create(superAdminId, input);

    return ApiResponse.success<RestaurantDto>(
      toRestaurantDto(restaurant),
      HttpStatus.CREATED,
    );
  } catch (error) {
    return ApiResponse.fromError(error, "Не удалось создать ресторан");
  }
};
