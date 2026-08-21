import type { CreateRestaurantRequest, RestaurantDto } from "@/api-contracts";
import { ApiResponse, HttpStatus } from "@/app/api/common/api-response";
import { validateRequestBody } from "@/app/api/common/validate-request";
import { toRestaurantDto } from "@/app/api/restaurants/restaurant.mapper";
import { restaurantService } from "@/app/api/restaurants/restaurant.service";
import { createRestaurantRequestSchema } from "@/app/api/restaurants/restaurant.validation";
import { getSuperAdminId } from "@/app/api/super-admin/auth";

export const GET = async (request: Request) => {
  try {
    const superAdminId = await getSuperAdminId(request);
    const restaurants = await restaurantService.getAll(superAdminId);

    return ApiResponse.success<RestaurantDto[]>(
      restaurants.map(toRestaurantDto),
    );
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
