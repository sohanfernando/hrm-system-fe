import { buildQuery, request } from "@/lib/api/client";
import type { MessageResponse, PaginatedResponse } from "@/types/common";
import type { Position, PositionCreateRequest, PositionUpdateRequest } from "@/types/position";

export const positionsApi = {
  list: (params?: { skip?: number; limit?: number; department_id?: number }) =>
    request<PaginatedResponse<Position>>(`/positions${buildQuery(params)}`),
  get: (id: number) => request<Position>(`/positions/${id}`),
  create: (data: PositionCreateRequest) =>
    request<Position>("/positions", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: PositionUpdateRequest) =>
    request<Position>(`/positions/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  remove: (id: number) => request<MessageResponse>(`/positions/${id}`, { method: "DELETE" }),
};
