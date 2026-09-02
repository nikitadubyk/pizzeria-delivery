import type {
  CreateRestaurantUserRequest,
  RestaurantUserDto,
  RestaurantUserListQuery,
  RestaurantUserListResponse,
} from "@/api-contracts";
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
    const { page, limit } = await validateRequestData<
      Required<RestaurantUserListQuery>
    >(searchParams, restaurantUserListQuerySchema);
    const { items, total } = await userService.getRestaurantUserPage(
      superAdminId,
      { page, limit },
    );

    return ApiResponse.success<RestaurantUserListResponse>({
      items: items.map(toRestaurantUserDto),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
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
