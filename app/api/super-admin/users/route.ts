import type {
  CreateRestaurantUserRequest,
  ResolvedSearchPaginationQuery,
  RestaurantUserDto,
  RestaurantUserListResponse,
} from "@/api-contracts";
import { createPaginationMeta } from "@/app/api/common/list-query";
import { ApiResponse, HttpStatus } from "@/app/api/common/api-response";
import {
  validateRequestBody,
  validateRequestData,
} from "@/app/api/common/validate-request";
import { getSuperAdminId } from "@/app/api/super-admin/auth";
import { toRestaurantUserDto } from "@/app/api/users/user.mapper";
import { userService } from "@/app/api/users/user.service";
import {
  createRestaurantUserRequestSchema,
  restaurantUserListQuerySchema,
} from "@/app/api/users/user.validation";

export const GET = async (request: Request) => {
  try {
    const superAdminId = await getSuperAdminId(request);
    const searchParams = Object.fromEntries(new URL(request.url).searchParams);
    const query = await validateRequestData<
      ResolvedSearchPaginationQuery
    >(searchParams, restaurantUserListQuerySchema);
    const { page, limit } = query;
    const { items, total } = await userService.getRestaurantUserPage(
      superAdminId,
      query,
    );

    return ApiResponse.success<RestaurantUserListResponse>({
      items: items.map(toRestaurantUserDto),
      pagination: createPaginationMeta({ page, limit, total }),
    });
  } catch (error) {
    return ApiResponse.fromError(error, "Не удалось получить пользователей");
  }
};

export const POST = async (request: Request) => {
  try {
    const superAdminId = await getSuperAdminId(request);
    const input = await validateRequestBody<CreateRestaurantUserRequest>(
      request,
      createRestaurantUserRequestSchema,
    );
    const user = await userService.createRestaurantUser(superAdminId, input);

    return ApiResponse.success<RestaurantUserDto>(
      toRestaurantUserDto(user),
      HttpStatus.CREATED,
    );
  } catch (error) {
    return ApiResponse.fromError(error, "Не удалось создать пользователя");
  }
};
