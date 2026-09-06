import type { SuperAdminUserDto } from "@/api-contracts";
import { userService } from "@/app/api/users/user.service";
import { getBearerToken } from "@/lib/auth/bearer-token";

export const getCurrentSuperAdmin = async (
  request: Request,
): Promise<SuperAdminUserDto> => {
  return userService.getCurrentSuperAdmin(await getBearerToken(request));
};

export const getSuperAdminId = async (request: Request): Promise<string> =>
  (await getCurrentSuperAdmin(request)).id;
