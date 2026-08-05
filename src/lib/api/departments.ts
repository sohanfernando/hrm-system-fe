import { buildQuery, request } from "@/lib/api/client";
import type { MessageResponse, PaginatedResponse } from "@/types/common";
import type {
  Department,
  DepartmentCreateRequest,
  DepartmentUpdateRequest,
} from "@/types/department";

export const departmentsApi = {
  list: (params?: { skip?: number; limit?: number }) =>
    request<PaginatedResponse<Department>>(`/departments${buildQuery(params)}`),
  get: (id: number) => request<Department>(`/departments/${id}`),
  create: (data: DepartmentCreateRequest) =>
    request<Department>("/departments", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: DepartmentUpdateRequest) =>
    request<Department>(`/departments/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  remove: (id: number) => request<MessageResponse>(`/departments/${id}`, { method: "DELETE" }),
};
