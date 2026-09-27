import type {
  EmployeeDto,
  EmployeePathParams,
  UpdateEmployeeStatusRequest,
} from "@/api-contracts";
import { ApiResponse } from "@/app/api/common/api-response";
import {
  validateRequestBody,
  validateRouteParams,
} from "@/app/api/common/validate-request";
import { toRestaurantUserDto } from "@/app/api/users/user.mapper";
import { userService } from "@/app/api/users/user.service";
import {
  employeePathParamsSchema,
  updateEmployeeStatusRequestSchema,
} from "@/app/api/users/user.validation";
import { RESTAURANT_PERMISSION as P } from "@/lib/auth/restaurant-permissions";
import { requireRestaurantPermission } from "../../../require-permission";
import type { EmployeeStatusRouteContext } from "./types";

export const PATCH = async (
  request: Request,
  { params }: EmployeeStatusRouteContext
) => {
  try {
    const identity = await requireRestaurantPermission(
      request,
      P.EMPLOYEES_READ
    );
    const [{ employeeId }, input] = await Promise.all([
      params.then((value) =>
        validateRouteParams<EmployeePathParams>(value, employeePathParamsSchema)
      ),
      validateRequestBody<UpdateEmployeeStatusRequest>(
        request,
        updateEmployeeStatusRequestSchema
      ),
    ]);
    await requireRestaurantPermission(
      request,
      input.isActive ? P.EMPLOYEES_RECOVER : P.EMPLOYEES_DISABLE
    );
    const employee = await userService.updateEmployeeStatus(
      identity.restaurant.id,
      employeeId,
      input.isActive
    );

    return ApiResponse.success<EmployeeDto>(
      toRestaurantUserDto(employee) as EmployeeDto
    );
  } catch (error) {
    return ApiResponse.fromError(
      error,
      "Не удалось изменить доступ сотрудника"
    );
  }
};
