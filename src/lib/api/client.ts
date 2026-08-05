import { clearStoredUser, clearToken, getToken } from "@/lib/auth";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

export class ApiError extends Error {
  status: number;
  errors?: Array<{ loc: (string | number)[]; msg: string; type: string }>;

  constructor(message: string, status: number, errors?: ApiError["errors"]) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

interface RequestOptions extends RequestInit {
  /** Skip attaching the Authorization header (used for login/register). */
  skipAuth?: boolean;
}

export function buildQuery(
  params?: Record<string, string | number | boolean | undefined | null>
): string {
  if (!params) return "";
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      search.append(key, String(value));
    }
  }
  const query = search.toString();
  return query ? `?${query}` : "";
}

/** Shared fetch wrapper used by every resource module in lib/api/. */
export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { skipAuth, headers, ...rest } = options;
  const isFormData = rest.body instanceof FormData;

  const finalHeaders: HeadersInit = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...headers,
  };

  if (!skipAuth) {
    const token = getToken();
    if (token) {
      (finalHeaders as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, { ...rest, headers: finalHeaders });

  if (response.status === 401 && !skipAuth) {
    clearToken();
    clearStoredUser();
    if (typeof window !== "undefined") {
      // A plain module (not a component/hook) has no router instance to call;
      // a hard navigation is the correct way to force a full session reset here.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.href = "/login";
    }
  }

  if (!response.ok) {
    let detail = `Request failed with status ${response.status}`;
    let errors: ApiError["errors"];
    try {
      const body = await response.json();
      detail = body.detail ?? detail;
      errors = body.errors;
    } catch {
      // response had no JSON body
    }
    throw new ApiError(detail, response.status, errors);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
