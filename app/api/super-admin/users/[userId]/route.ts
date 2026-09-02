import type {
  RestaurantUserDto,
  RestaurantUserPathParams,
  UpdateRestaurantUserRequest,
} from "@/api-contracts";
import { ApiResponse } from "@/app/api/common/api-response";
import {
  validateRequestBody,
  validateRouteParams,
} from "@/app/api/common/validate-request";
import { getSuperAdminId } from "@/app/api/super-admin/auth";
import { toRestaurantUserDto } from "@/app/api/users/user.mapper";
import { userService } from "@/app/api/users/user.service";
import {
  restaurantUserPathParamsSchema,
  updateRestaurantUserRequestSchema,
} from "@/app/api/users/user.validation";

type RestaurantUserRouteContext = {
  params: Promise<RestaurantUserPathParams>;
};

export const GET = async (
  request: Request,
  { params }: RestaurantUserRouteContext,
) => {
  try {
    const [superAdminId, { userId }] = await Promise.all([
      getSuperAdminId(request),
      params.then((value) =>
        validateRouteParams<RestaurantUserPathParams>(
          value,
          restaurantUserPathParamsSchema,
        ),
      ),
    ]);
    const user = await userService.getRestaurantUserById(superAdminId, userId);

    return ApiResponse.success<RestaurantUserDto>(toRestaurantUserDto(user));
  } catch (error) {
    return ApiResponse.fromError(error, "Не удалось получить пользователя");
  }
};

export const PATCH = async (
  request: Request,
  { params }: RestaurantUserRouteContext,
) => {
  try {
    const [superAdminId, { userId }, input] = await Promise.all([
      getSuperAdminId(request),
      params.then((value) =>
        validateRouteParams<RestaurantUserPathParams>(
          value,
          restaurantUserPathParamsSchema,
        ),
      ),
      validateRequestBody<UpdateRestaurantUserRequest>(
        request,
        updateRestaurantUserRequestSchema,
      ),
    ]);
    const user = await userService.updateRestaurantUser(
      superAdminId,
      userId,
      input,
    );

    return ApiResponse.success<RestaurantUserDto>(toRestaurantUserDto(user));
  } catch (error) {
    return ApiResponse.fromError(error, "Не удалось обновить пользователя");
  }
};

export const DELETE = async (
  request: Request,
  { params }: RestaurantUserRouteContext,
) => {
  try {
    const [superAdminId, { userId }] = await Promise.all([
      getSuperAdminId(request),
      params.then((value) =>
        validateRouteParams<RestaurantUserPathParams>(
          value,
          restaurantUserPathParamsSchema,
        ),
      ),
    ]);
    const user = await userService.deleteRestaurantUser(superAdminId, userId);

    return ApiResponse.success<RestaurantUserDto>(toRestaurantUserDto(user));
  } catch (error) {
    return ApiResponse.fromError(error, "Не удалось удалить пользователя");
  }
};
