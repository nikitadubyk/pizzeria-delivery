import type { EmployeeDto } from "@/api-contracts";

export type EmployeeFormValues = {
  name: string;
  phone: string;
  email: string;
  password: string;
};

export type EmployeeFormDialogProps = {
  employeeId: string | null;
  onClose: () => void;
  onCreated: () => void;
  opened: boolean;
};

export type EmployeeDetailsDialogProps = {
  employeeId: string | null;
  onClose: () => void;
  onEdit: (employeeId: string) => void;
  onExited: () => void;
  opened: boolean;
};

export type EmployeeStatusDialogProps = {
  employee: EmployeeDto | null;
  onClose: () => void;
  onExited: () => void;
  opened: boolean;
};
