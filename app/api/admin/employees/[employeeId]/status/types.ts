import type { EmployeePathParams } from "@/api-contracts";

export type EmployeeStatusRouteContext = {
  params: Promise<EmployeePathParams>;
};
