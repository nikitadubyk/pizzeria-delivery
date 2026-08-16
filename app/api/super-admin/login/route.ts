import {
  type SuperAdminLoginInput,
  userService,
} from "@/app/api/users/user.service";
import { ApiResponse } from "@/app/api/common/api-response";

export const POST = async (request: Request) => {
  try {
    const input = (await request.json()) as SuperAdminLoginInput;
    const result = await userService.login(input);

    return ApiResponse.success(result);
  } catch (error) {
    return ApiResponse.fromError(error, "Не удалось выполнить вход");
  }
};
