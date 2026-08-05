export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
}

export interface MessageResponse {
  message: string;
}

export interface ApiErrorBody {
  detail: string;
  errors?: Array<{ loc: (string | number)[]; msg: string; type: string }>;
}
