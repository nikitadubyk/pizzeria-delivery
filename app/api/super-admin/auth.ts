import type { SuperAdminUserDto } from "@/api-contracts";
import { HttpStatus } from "@/app/api/common/api-response";
import { validateRequestData } from "@/app/api/common/validate-request";
import { userService } from "@/app/api/users/user.service";
import type { AuthorizationHeader } from "@/app/api/users/types";
import { authorizationHeaderSchema } from "@/app/api/users/user.validation";

export const getCurrentSuperAdmin = async (
  request: Request,
): Promise<SuperAdminUserDto> => {
  const { authorization } = await validateRequestData<AuthorizationHeader>(
    { authorization: request.headers.get("authorization") },
    authorizationHeaderSchema,
    HttpStatus.UNAUTHORIZED,
  );
  const token = authorization.slice("Bearer ".length);

  return userService.getCurrentSuperAdmin(token);
};

export const getSuperAdminId = async (request: Request): Promise<string> =>
  (await getCurrentSuperAdmin(request)).id;
