import type { SuperAdminRefreshRequest } from "@/api-contracts";
import { ApiResponse } from "@/app/api/common/api-response";
import { validateRequestBody } from "@/app/api/common/validate-request";
import { userService } from "@/app/api/users/user.service";
import { superAdminRefreshRequestSchema } from "@/app/api/users/user.validation";

export const POST = async (request: Request) => {
  try {
    const input = await validateRequestBody<SuperAdminRefreshRequest>(
      request,
      superAdminRefreshRequestSchema,
    );
    const result = await userService.refresh(input);

    return ApiResponse.success(result);
  } catch (error) {
    return ApiResponse.fromError(error, "Не удалось обновить токен");
  }
};
