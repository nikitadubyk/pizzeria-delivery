import type { SuperAdminUserDto } from "@/api-contracts";
import { ApiResponse } from "@/app/api/common/api-response";
import { getCurrentSuperAdmin } from "@/app/api/super-admin/auth";

export const GET = async (request: Request) => {
  try {
    const user = await getCurrentSuperAdmin(request);

    return ApiResponse.success<SuperAdminUserDto>(user);
  } catch (error) {
    return ApiResponse.fromError(error, "Не удалось проверить авторизацию");
  }
};
