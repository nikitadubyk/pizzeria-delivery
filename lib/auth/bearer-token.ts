import { HttpStatus } from "@/app/api/common/api-response";
import { validateRequestData } from "@/app/api/common/validate-request";
import { authorizationHeaderSchema } from "@/app/api/users/user.validation";

export async function getBearerToken(request: Request): Promise<string> {
  const { authorization } = await validateRequestData(
    { authorization: request.headers.get("authorization") },
    authorizationHeaderSchema,
    HttpStatus.UNAUTHORIZED,
  );
  return authorization.slice("Bearer ".length);
}
