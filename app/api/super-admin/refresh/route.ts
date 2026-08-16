import { ApiResponse } from "@/app/api/common/api-response";
import {
  type SuperAdminRefreshInput,
  userService,
} from "@/app/api/users/user.service";

export const POST = async (request: Request) => {
  try {
    const input = (await request.json()) as SuperAdminRefreshInput;
    const result = await userService.refresh(input);

    return ApiResponse.success(result);
  } catch (error) {
    return ApiResponse.fromError(error, "Не удалось обновить токен");
  }
};
