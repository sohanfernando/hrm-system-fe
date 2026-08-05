import { buildQuery, request } from "@/lib/api/client";
import type { MessageResponse, PaginatedResponse } from "@/types/common";
import type {
  Employee,
  EmployeeCreateRequest,
  EmployeeStatus,
  EmployeeUpdateRequest,
} from "@/types/employee";

export const employeesApi = {
  list: (params?: {
    skip?: number;
    limit?: number;
    department_id?: number;
    status?: EmployeeStatus;
  }) => request<PaginatedResponse<Employee>>(`/employees${buildQuery(params)}`),
  get: (id: number) => request<Employee>(`/employees/${id}`),
  create: (data: EmployeeCreateRequest) =>
    request<Employee>("/employees", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: EmployeeUpdateRequest) =>
    request<Employee>(`/employees/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  remove: (id: number) => request<MessageResponse>(`/employees/${id}`, { method: "DELETE" }),
};
