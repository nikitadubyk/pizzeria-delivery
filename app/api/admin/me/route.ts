import { ApiResponse } from "@/app/api/common/api-response";
import { getBearerToken } from "@/lib/auth/bearer-token";
import { restaurantAuth } from "../auth.service";

export async function GET(request: Request) {
  try {
    const user = await restaurantAuth.authenticate(await getBearerToken(request));
    return Response.json(user, { headers: { "Cache-Control": "no-store" } });
  }
  catch (error) { return ApiResponse.fromError(error, "Не удалось проверить сессию"); }
}
