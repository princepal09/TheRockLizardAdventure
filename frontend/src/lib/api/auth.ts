import type { ApiDataResponse, ApiResponse } from "@/types/api";

import type {
  Admin,
  ChangePasswordInput,
  LoginFormValues,
  LoginResult,
  ResetPasswordInput,
  UpdateProfileInput,
} from "@/types/auth";

import api, { publicApi } from "../axios";

// ==========================================
// Authorization Headers
// ==========================================

const bearerAuth = (accessToken: string) => ({
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});

// ==========================================
// LOGIN
// ==========================================

export async function login(input: LoginFormValues) {
  const { data } = await publicApi.post<ApiDataResponse<LoginResult>>("/auth/login", input);

  return data.data;
}

// ==========================================
// GET CURRENT ADMIN
// ==========================================

export async function getCurrentAdmin(accessToken: string) {
  const { data } = await api.get<ApiDataResponse<Admin>>("/auth/me", bearerAuth(accessToken));

  return data.data;
}

// ==========================================
// LOGOUT
// ==========================================

export async function logout(accessToken: string) {
  const { data } = await api.post<ApiResponse>("/auth/logout", undefined, bearerAuth(accessToken));

  return data;
}

// ==========================================
// LOGOUT FROM ALL DEVICES
// ==========================================

export async function logoutAll(accessToken: string) {
  const { data } = await api.post<ApiResponse>(
    "/auth/logout-all",
    undefined,
    bearerAuth(accessToken),
  );

  return data;
}

// ==========================================
// CHANGE PASSWORD
// ==========================================

export async function changePassword(input: ChangePasswordInput, accessToken: string) {
  const { data } = await api.patch<ApiResponse>(
    "/auth/change-password",
    input,
    bearerAuth(accessToken),
  );

  return data;
}

// ==========================================
// FORGOT PASSWORD
// ==========================================

export async function forgotPassword(email: string) {
  const { data } = await publicApi.post<ApiResponse>("/auth/forgot-password", {
    email,
  });

  return data;
}

// ==========================================
// RESET PASSWORD
// ==========================================

export async function resetPassword(input: ResetPasswordInput) {
  const { data } = await publicApi.post<ApiResponse>("/auth/reset-password", input);

  return data;
}

// ==========================================
// UPDATE PROFILE
// ==========================================

export async function updateProfile(input: UpdateProfileInput, accessToken: string) {
  const body = new FormData();

  if (input.name !== undefined) {
    body.set("name", input.name);
  }

  if (input.profileImage) {
    body.set("profileImage", input.profileImage);
  }

  const { data } = await api.patch<ApiDataResponse<Admin>>(
    "/auth/update-profile",
    body,
    bearerAuth(accessToken),
  );

  return data.data;
}
