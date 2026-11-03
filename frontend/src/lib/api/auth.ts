import type { ApiDataResponse, ApiResponse } from "@/types/api";
import type {
  Admin,
  ChangePasswordInput,
  LoginFormValues,
  LoginResult,
  RefreshResult,
  ResetPasswordInput,
  UpdateProfileInput,
} from "@/types/auth";

import { api } from "./client";

const bearerAuth = (accessToken: string) => ({
  headers: { Authorization: `Bearer ${accessToken}` },
});

export async function login(input: LoginFormValues) {
  const { data } = await api.post<ApiDataResponse<LoginResult>>(
    "/auth/login",
    input,
  );
  return data.data;
}

export async function refreshSession() {
  const { data } =
    await api.post<ApiDataResponse<RefreshResult>>("/auth/refresh");
  return data.data;
}

export async function getCurrentAdmin(accessToken: string) {
  const { data } = await api.get<ApiDataResponse<Admin>>(
    "/auth/me",
    bearerAuth(accessToken),
  );
  return data.data;
}

export async function logout(accessToken: string) {
  const { data } = await api.post<ApiResponse>(
    "/auth/logout",
    undefined,
    bearerAuth(accessToken),
  );
  return data;
}

export async function logoutAll(accessToken: string) {
  const { data } = await api.post<ApiResponse>(
    "/auth/logout-all",
    undefined,
    bearerAuth(accessToken),
  );
  return data;
}

export async function changePassword(
  input: ChangePasswordInput,
  accessToken: string,
) {
  const { data } = await api.patch<ApiResponse>(
    "/auth/change-password",
    input,
    bearerAuth(accessToken),
  );
  return data;
}

export async function forgotPassword(email: string) {
  const { data } = await api.post<ApiResponse>("/auth/forgot-password", {
    email,
  });
  return data;
}

export async function resetPassword(input: ResetPasswordInput) {
  const { data } = await api.post<ApiResponse>("/auth/reset-password", input);
  return data;
}

export async function updateProfile(
  input: UpdateProfileInput,
  accessToken: string,
) {
  const body = new FormData();
  if (input.name !== undefined) body.set("name", input.name);
  if (input.profileImage) body.set("profileImage", input.profileImage);

  const { data } = await api.patch<ApiDataResponse<Admin>>(
    "/auth/update-profile",
    body,
    bearerAuth(accessToken),
  );
  return data.data;
}
