import type { SuperAdminLoginRequest } from "@/api-contracts";
import { ApiResponse } from "@/app/api/common/api-response";
import { validateRequestBody } from "@/app/api/common/validate-request";
import { userService } from "@/app/api/users/user.service";
import { superAdminLoginRequestSchema } from "@/app/api/users/user.validation";

export const POST = async (request: Request) => {
  try {
    const input = await validateRequestBody<SuperAdminLoginRequest>(
      request,
      superAdminLoginRequestSchema,
    );
    const result = await userService.login(input);

    return ApiResponse.success(result);
  } catch (error) {
    return ApiResponse.fromError(error, "Не удалось выполнить вход");
  }
};
