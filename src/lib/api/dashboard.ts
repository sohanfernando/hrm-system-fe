import { request } from "@/lib/api/client";
import type { DashboardSummary } from "@/types/dashboard";

export const dashboardApi = {
  summary: () => request<DashboardSummary>("/dashboard/summary"),
};
