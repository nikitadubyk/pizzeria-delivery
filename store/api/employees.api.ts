import type {
  CreateEmployeeRequest,
  EmployeeDto,
  EmployeeListResponse,
  EmployeePathParams,
  ResolvedSearchPaginationQuery,
  UpdateEmployeeApiRequest,
  UpdateEmployeeStatusApiRequest,
} from "@/api-contracts";

import { API_ROUTES, URL } from "./config";
import { restaurantAuthApi } from "./restaurant-auth.api";

const EMPLOYEE_TAG = "Employee" as const;

export const employeesApi = restaurantAuthApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmployees: builder.query<
      EmployeeListResponse,
      ResolvedSearchPaginationQuery
    >({
      query: (params) => ({
        url: URL.RESTAURANT_EMPLOYEES,
        method: "GET",
        params,
      }),
      providesTags: [EMPLOYEE_TAG],
    }),
    getEmployee: builder.query<EmployeeDto, EmployeePathParams>({
      query: ({ employeeId }) => ({
        url: API_ROUTES.restaurantEmployee(employeeId),
        method: "GET",
      }),
      providesTags: [EMPLOYEE_TAG],
    }),
    createEmployee: builder.mutation<EmployeeDto, CreateEmployeeRequest>({
      query: (data) => ({
        url: URL.RESTAURANT_EMPLOYEES,
        method: "POST",
        data,
      }),
      invalidatesTags: [EMPLOYEE_TAG],
    }),
    updateEmployee: builder.mutation<EmployeeDto, UpdateEmployeeApiRequest>({
      query: ({ employeeId, data }) => ({
        url: API_ROUTES.restaurantEmployee(employeeId),
        method: "PATCH",
        data,
      }),
      invalidatesTags: [EMPLOYEE_TAG],
    }),
    updateEmployeeStatus: builder.mutation<
      EmployeeDto,
      UpdateEmployeeStatusApiRequest
    >({
      query: ({ employeeId, data }) => ({
        url: API_ROUTES.restaurantEmployeeStatus(employeeId),
        method: "PATCH",
        data,
      }),
      invalidatesTags: [EMPLOYEE_TAG],
    }),
  }),
});

export const {
  useCreateEmployeeMutation,
  useGetEmployeeQuery,
  useGetEmployeesQuery,
  useUpdateEmployeeMutation,
  useUpdateEmployeeStatusMutation,
} = employeesApi;
