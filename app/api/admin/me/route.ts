import { ApiResponse } from "@/app/api/common/api-response";
import { RESTAURANT_PERMISSION } from "@/lib/auth/restaurant-permissions";
import { requireRestaurantPermission } from "../require-permission";

export async function GET(request: Request) {
  try {
    const user = await requireRestaurantPermission(request, RESTAURANT_PERMISSION.ADMIN_ACCESS);
    return Response.json(user, { headers: { "Cache-Control": "no-store" } });
  }
  catch (error) { return ApiResponse.fromError(error, "Не удалось проверить сессию"); }
}
