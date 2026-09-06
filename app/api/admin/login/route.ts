import { ApiResponse } from "@/app/api/common/api-response";
import { validateRequestBody } from "@/app/api/common/validate-request";
import { restaurantAuth } from "../auth.service";
import { restaurantLoginSchema } from "../auth.validation";

export async function POST(request: Request) {
  try {
    const input = await validateRequestBody(request, restaurantLoginSchema);
    const accessToken = await restaurantAuth.login(input);
    return Response.json({ accessToken }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return ApiResponse.fromError(error, "Не удалось выполнить вход");
  }
}
