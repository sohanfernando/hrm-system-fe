import type { User } from "@/types/auth";

/**
 * Token storage.
 *
 * The JWT is kept in a (non-HttpOnly) cookie rather than localStorage so that
 * Next.js middleware — which runs on the edge, before any page renders — can
 * read it and redirect unauthenticated users away from protected routes.
 *
 * Note: a real production deployment would issue the token as an HttpOnly
 * cookie set by the backend itself (or proxy auth through a Next.js route
 * handler) to fully protect it from XSS. Keeping it readable client-side here
 * keeps the demo's auth flow simple and self-contained for this assessment.
 */
const TOKEN_COOKIE_NAME = "hrm_token";
const USER_STORAGE_KEY = "hrm_user";

export function setToken(token: string, expiresInMinutes: number): void {
  if (typeof document === "undefined") return;
  const maxAgeSeconds = expiresInMinutes * 60;
  document.cookie = `${TOKEN_COOKIE_NAME}=${token}; path=/; max-age=${maxAgeSeconds}; samesite=lax`;
}

export function getToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${TOKEN_COOKIE_NAME}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function clearToken(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${TOKEN_COOKIE_NAME}=; path=/; max-age=0`;
}

export function setStoredUser(user: User): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(USER_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function clearStoredUser(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(USER_STORAGE_KEY);
}

export function isAdmin(user: User | null): boolean {
  return user?.role === "ADMIN";
}
