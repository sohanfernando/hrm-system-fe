import { buildQuery, request } from "@/lib/api/client";
import type { MessageResponse, PaginatedResponse } from "@/types/common";
import type { PaymentStatus, Payroll, PayrollCreateRequest, PayrollUpdateRequest } from "@/types/payroll";

export const payrollApi = {
  list: (params?: {
    skip?: number;
    limit?: number;
    employee_id?: number;
    payment_status?: PaymentStatus;
    month?: number;
    year?: number;
  }) => request<PaginatedResponse<Payroll>>(`/payrolls${buildQuery(params)}`),
  get: (id: number) => request<Payroll>(`/payrolls/${id}`),
  create: (data: PayrollCreateRequest) =>
    request<Payroll>("/payrolls", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: PayrollUpdateRequest) =>
    request<Payroll>(`/payrolls/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  remove: (id: number) => request<MessageResponse>(`/payrolls/${id}`, { method: "DELETE" }),
};
