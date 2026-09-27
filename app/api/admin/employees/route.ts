import type {
  CreateEmployeeRequest,
  EmployeeDto,
  EmployeeListResponse,
  ResolvedSearchPaginationQuery,
} from "@/api-contracts";
import { createPaginationMeta } from "@/app/api/common/list-query";
import { ApiResponse, HttpStatus } from "@/app/api/common/api-response";
import {
  validateRequestBody,
  validateRequestData,
} from "@/app/api/common/validate-request";
import { toRestaurantUserDto } from "@/app/api/users/user.mapper";
import { userService } from "@/app/api/users/user.service";
import {
  createEmployeeRequestSchema,
  employeeListQuerySchema,
} from "@/app/api/users/user.validation";
import { RESTAURANT_PERMISSION as P } from "@/lib/auth/restaurant-permissions";
import { requireRestaurantPermission } from "../require-permission";

const toEmployeeDto = (employee: Parameters<typeof toRestaurantUserDto>[0]) =>
  toRestaurantUserDto(employee) as EmployeeDto;

export const GET = async (request: Request) => {
  try {
    const [identity, pagination] = await Promise.all([
      requireRestaurantPermission(request, P.EMPLOYEES_READ),
      validateRequestData<ResolvedSearchPaginationQuery>(
        Object.fromEntries(new URL(request.url).searchParams),
        employeeListQuerySchema
      ),
    ]);
    const { page, limit } = pagination;
    const { items, total } = await userService.getEmployeePage(
      identity.restaurant.id,
      pagination
    );

    return ApiResponse.success<EmployeeListResponse>({
      items: items.map(toEmployeeDto),
      pagination: createPaginationMeta({ page, limit, total }),
    });
  } catch (error) {
    return ApiResponse.fromError(error, "Не удалось получить сотрудников");
  }
};

export const POST = async (request: Request) => {
  try {
    const [identity, input] = await Promise.all([
      requireRestaurantPermission(request, P.EMPLOYEES_MANAGE),
      validateRequestBody<CreateEmployeeRequest>(
        request,
        createEmployeeRequestSchema
      ),
    ]);
    const employee = await userService.createEmployee(
      identity.restaurant.id,
      input
    );

    return ApiResponse.success<EmployeeDto>(
      toEmployeeDto(employee),
      HttpStatus.CREATED
    );
  } catch (error) {
    return ApiResponse.fromError(error, "Не удалось создать сотрудника");
  }
};
