export interface Position {
  id: number;
  department_id: number;
  title: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PositionCreateRequest {
  department_id: number;
  title: string;
  description?: string | null;
  is_active?: boolean;
}

export type PositionUpdateRequest = Partial<PositionCreateRequest>;
