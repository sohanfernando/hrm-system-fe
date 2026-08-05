export type PaymentStatus = "PENDING" | "PAID" | "FAILED";

export interface Payroll {
  id: number;
  employee_id: number;
  month: number;
  year: number;
  basic_salary: string;
  allowances: string;
  deductions: string;
  net_salary: string;
  payment_status: PaymentStatus;
  created_at: string;
  updated_at: string;
}

export interface PayrollCreateRequest {
  employee_id: number;
  month: number;
  year: number;
  basic_salary: number;
  allowances?: number;
  deductions?: number;
  payment_status?: PaymentStatus;
}

export type PayrollUpdateRequest = Partial<
  Pick<PayrollCreateRequest, "basic_salary" | "allowances" | "deductions" | "payment_status">
>;

export const PAYMENT_STATUS_OPTIONS: { value: PaymentStatus; label: string }[] = [
  { value: "PENDING", label: "Pending" },
  { value: "PAID", label: "Paid" },
  { value: "FAILED", label: "Failed" },
];
