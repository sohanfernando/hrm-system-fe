import { request } from "@/lib/api/client";
import type { LoginRequest, RegisterRequest, TokenResponse, User } from "@/types/auth";
import type { MessageResponse } from "@/types/common";

export const authApi = {
  register: (data: RegisterRequest) =>
    request<TokenResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
      skipAuth: true,
    }),
  login: (data: LoginRequest) =>
    request<TokenResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
      skipAuth: true,
    }),
  me: () => request<User>("/auth/me"),
  logout: () => request<MessageResponse>("/auth/logout", { method: "POST" }),
};
