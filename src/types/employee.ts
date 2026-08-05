export type EmployeeStatus = "ACTIVE" | "INACTIVE" | "ONBOARDING" | "TERMINATED";

export type EmploymentType = "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERN";

export type DocumentType =
  | "NIC_ID_COPY"
  | "PASSPORT_COPY"
  | "CV_RESUME"
  | "EDUCATION_CERTIFICATE"
  | "EMPLOYMENT_LETTER"
  | "BANK_DETAILS"
  | "SIGNED_CONTRACT"
  | "OTHER";

export interface Employee {
  id: number;
  employee_code: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  address: string | null;
  department_id: number;
  position_id: number;
  joining_date: string;
  employment_type: EmploymentType;
  basic_salary: string;
  status: EmployeeStatus;
  created_at: string;
  updated_at: string;
}

export interface EmployeeCreateRequest {
  employee_code: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  department_id: number;
  position_id: number;
  joining_date: string;
  employment_type: EmploymentType;
  basic_salary: number;
  status?: EmployeeStatus;
}

export type EmployeeUpdateRequest = Partial<EmployeeCreateRequest>;

export interface EmployeeDocument {
  id: number;
  employee_id: number;
  document_type: DocumentType;
  original_file_name: string;
  file_size: number;
  mime_type: string;
  uploaded_by: number | null;
  uploaded_at: string;
}

export const EMPLOYMENT_TYPE_OPTIONS: { value: EmploymentType; label: string }[] = [
  { value: "FULL_TIME", label: "Full-time" },
  { value: "PART_TIME", label: "Part-time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "INTERN", label: "Intern" },
];

export const EMPLOYEE_STATUS_OPTIONS: { value: EmployeeStatus; label: string }[] = [
  { value: "ONBOARDING", label: "Onboarding" },
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "TERMINATED", label: "Terminated" },
];

export const DOCUMENT_TYPE_OPTIONS: { value: DocumentType; label: string }[] = [
  { value: "NIC_ID_COPY", label: "NIC / ID Copy" },
  { value: "PASSPORT_COPY", label: "Passport Copy" },
  { value: "CV_RESUME", label: "CV / Resume" },
  { value: "EDUCATION_CERTIFICATE", label: "Education Certificate" },
  { value: "EMPLOYMENT_LETTER", label: "Previous Employment Letter" },
  { value: "BANK_DETAILS", label: "Bank Details" },
  { value: "SIGNED_CONTRACT", label: "Signed Contract" },
  { value: "OTHER", label: "Other" },
];
