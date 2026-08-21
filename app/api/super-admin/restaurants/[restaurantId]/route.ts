import type {
  RestaurantDto,
  RestaurantPathParams,
  UpdateRestaurantRequest,
} from "@/api-contracts";
import { ApiResponse } from "@/app/api/common/api-response";
import {
  validateRequestBody,
  validateRouteParams,
} from "@/app/api/common/validate-request";
import { toRestaurantDto } from "@/app/api/restaurants/restaurant.mapper";
import { restaurantService } from "@/app/api/restaurants/restaurant.service";
import {
  restaurantPathParamsSchema,
  updateRestaurantRequestSchema,
} from "@/app/api/restaurants/restaurant.validation";
import { getSuperAdminId } from "@/app/api/super-admin/auth";

type RestaurantRouteContext = {
  params: Promise<RestaurantPathParams>;
};

export const GET = async (
  request: Request,
  { params }: RestaurantRouteContext,
) => {
  try {
    const [superAdminId, { restaurantId }] = await Promise.all([
      getSuperAdminId(request),
      params.then((value) =>
        validateRouteParams<RestaurantPathParams>(
          value,
          restaurantPathParamsSchema,
        ),
      ),
    ]);
    const restaurant = await restaurantService.getById(
      superAdminId,
      restaurantId,
    );

    return ApiResponse.success<RestaurantDto>(toRestaurantDto(restaurant));
  } catch (error) {
    return ApiResponse.fromError(error, "Не удалось получить ресторан");
  }
};

export const PATCH = async (
  request: Request,
  { params }: RestaurantRouteContext,
) => {
  try {
    const [superAdminId, { restaurantId }, input] = await Promise.all([
      getSuperAdminId(request),
      params.then((value) =>
        validateRouteParams<RestaurantPathParams>(
          value,
          restaurantPathParamsSchema,
        ),
      ),
      validateRequestBody<UpdateRestaurantRequest>(
        request,
        updateRestaurantRequestSchema,
      ),
    ]);
    const restaurant = await restaurantService.update(
      superAdminId,
      restaurantId,
      input,
    );

    return ApiResponse.success<RestaurantDto>(toRestaurantDto(restaurant));
  } catch (error) {
    return ApiResponse.fromError(error, "Не удалось обновить ресторан");
  }
};

export const DELETE = async (
  request: Request,
  { params }: RestaurantRouteContext,
) => {
  try {
    const [superAdminId, { restaurantId }] = await Promise.all([
      getSuperAdminId(request),
      params.then((value) =>
        validateRouteParams<RestaurantPathParams>(
          value,
          restaurantPathParamsSchema,
        ),
      ),
    ]);
    const restaurant = await restaurantService.delete(
      superAdminId,
      restaurantId,
    );

    return ApiResponse.success<RestaurantDto>(toRestaurantDto(restaurant));
  } catch (error) {
    return ApiResponse.fromError(error, "Не удалось удалить ресторан");
  }
};
