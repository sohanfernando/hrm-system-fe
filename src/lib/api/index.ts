// Barrel file: re-exports every resource module so callers can keep writing
// `import { departmentsApi } from "@/lib/api"` without knowing the internal
// per-resource file layout.
export { ApiError } from "@/lib/api/client";
export { authApi } from "@/lib/api/auth";
export { departmentsApi } from "@/lib/api/departments";
export { positionsApi } from "@/lib/api/positions";
export { employeesApi } from "@/lib/api/employees";
export { documentsApi } from "@/lib/api/documents";
export { payrollApi } from "@/lib/api/payroll";
export { dashboardApi } from "@/lib/api/dashboard";
