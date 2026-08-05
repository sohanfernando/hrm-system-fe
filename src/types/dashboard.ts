import type { Employee } from "./employee";
import type { Payroll } from "./payroll";

export interface DashboardSummary {
  total_employees: number;
  total_departments: number;
  total_positions: number;
  monthly_payroll_total: string;
  recent_employees: Employee[];
  pending_payrolls: Payroll[];
}
