import { ApiResponse, HttpStatus } from "@/app/api/common/api-response";
import { userService, UserServiceError } from "@/app/api/users/user.service";

export const GET = async (request: Request) => {
  try {
    const authorization = request.headers.get("authorization");

    if (!authorization?.startsWith("Bearer ")) {
      throw new UserServiceError(
        "Требуется авторизация",
        HttpStatus.UNAUTHORIZED,
      );
    }

    const user = await userService.getCurrentSuperAdmin(
      authorization.slice("Bearer ".length),
    );

    return ApiResponse.success(user);
  } catch (error) {
    return ApiResponse.fromError(error, "Не удалось проверить авторизацию");
  }
};
