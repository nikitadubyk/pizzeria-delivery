import type { PaginatedResponse, SearchPaginationQuery } from "./pagination";
import type { RestaurantUserDto } from "./super-admin";

export type EmployeeDto = RestaurantUserDto & { role: "EMPLOYEE" };

export type EmployeePathParams = {
  employeeId: string;
};

export type EmployeeListQuery = SearchPaginationQuery;
export type EmployeeListResponse = PaginatedResponse<EmployeeDto>;

export type CreateEmployeeRequest = {
  name: string;
  phone: string;
  email?: string | null;
  password: string;
};

export type UpdateEmployeeRequest = {
  name?: string;
  phone?: string;
  email?: string | null;
};

export type UpdateEmployeeApiRequest = EmployeePathParams & {
  data: UpdateEmployeeRequest;
};

export type UpdateEmployeeStatusRequest = {
  isActive: boolean;
};

export type UpdateEmployeeStatusApiRequest = EmployeePathParams & {
  data: UpdateEmployeeStatusRequest;
};
