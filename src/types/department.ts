export interface Department {
  id: number;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DepartmentCreateRequest {
  name: string;
  description?: string | null;
  is_active?: boolean;
}

export type DepartmentUpdateRequest = Partial<DepartmentCreateRequest>;
