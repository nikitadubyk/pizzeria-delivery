import type {
  EmployeeDto,
  EmployeePathParams,
  UpdateEmployeeRequest,
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
  updateEmployeeRequestSchema,
} from "@/app/api/users/user.validation";
import { RESTAURANT_PERMISSION as P } from "@/lib/auth/restaurant-permissions";
import { requireRestaurantPermission } from "../../require-permission";

type EmployeeRouteContext = {
  params: Promise<EmployeePathParams>;
};

const toEmployeeDto = (employee: Parameters<typeof toRestaurantUserDto>[0]) =>
  toRestaurantUserDto(employee) as EmployeeDto;

export const GET = async (
  request: Request,
  { params }: EmployeeRouteContext
) => {
  try {
    const [identity, { employeeId }] = await Promise.all([
      requireRestaurantPermission(request, P.EMPLOYEES_READ),
      params.then((value) =>
        validateRouteParams<EmployeePathParams>(value, employeePathParamsSchema)
      ),
    ]);
    const employee = await userService.getEmployeeById(
      identity.restaurant.id,
      employeeId
    );

    return ApiResponse.success<EmployeeDto>(toEmployeeDto(employee));
  } catch (error) {
    return ApiResponse.fromError(error, "Не удалось получить сотрудника");
  }
};

export const PATCH = async (
  request: Request,
  { params }: EmployeeRouteContext
) => {
  try {
    const [identity, { employeeId }, input] = await Promise.all([
      requireRestaurantPermission(request, P.EMPLOYEES_MANAGE),
      params.then((value) =>
        validateRouteParams<EmployeePathParams>(value, employeePathParamsSchema)
      ),
      validateRequestBody<UpdateEmployeeRequest>(
        request,
        updateEmployeeRequestSchema
      ),
    ]);
    const employee = await userService.updateEmployee(
      identity.restaurant.id,
      employeeId,
      input
    );

    return ApiResponse.success<EmployeeDto>(toEmployeeDto(employee));
  } catch (error) {
    return ApiResponse.fromError(error, "Не удалось обновить сотрудника");
  }
};
