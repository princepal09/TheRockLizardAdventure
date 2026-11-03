import axios, { type InternalAxiosRequestConfig } from "axios";

import { useAuthStore } from "@/stores/auth.store";
import type { ApiDataResponse } from "@/types/api";
import type { RefreshResult } from "@/types/auth";

const options = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
};

export const publicApi = axios.create(options);
const api = axios.create(options);

let pendingRefresh: { version: number; promise: Promise<string> } | undefined;

export function refreshAccessToken(): Promise<string> {
  const { sessionVersion } = useAuthStore.getState();
  if (pendingRefresh?.version === sessionVersion) {
    return pendingRefresh.promise;
  }

  const promise = publicApi
    .post<ApiDataResponse<RefreshResult>>("/auth/refresh")
    .then(({ data }) => {
      const state = useAuthStore.getState();
      if (state.sessionVersion !== sessionVersion) {
        throw new axios.CanceledError("Session changed");
      }

      const token = data.data.accessToken;
      state.setAccessToken(token);
      return token;
    })
    .catch((error: unknown) => {
      const state = useAuthStore.getState();
      if (
        state.sessionVersion === sessionVersion &&
        axios.isAxiosError(error) &&
        error.response?.status === 401
      ) {
        state.clearAuth();
      }
      throw error;
    })
    .finally(() => {
      if (pendingRefresh?.promise === promise) {
        pendingRefresh = undefined;
      }
    });

  pendingRefresh = { version: sessionVersion, promise };
  return promise;
}

type AuthRequest = InternalAxiosRequestConfig & {
  sessionVersion?: number;
  retried?: boolean;
};

api.interceptors.request.use((config: AuthRequest) => {
  const { accessToken, sessionVersion } = useAuthStore.getState();
  if (
    config.sessionVersion !== undefined &&
    config.sessionVersion !== sessionVersion
  ) {
    throw new axios.CanceledError("Session changed");
  }

  config.sessionVersion = sessionVersion;
  if (accessToken) {
    config.headers.set("Authorization", `Bearer ${accessToken}`);
  }
  return config;
});

api.interceptors.response.use(undefined, async (error: unknown) => {
  if (!axios.isAxiosError(error) || error.response?.status !== 401) {
    throw error;
  }

  const request: AuthRequest | undefined = error.config;
  const { accessToken, sessionVersion } = useAuthStore.getState();
  if (
    !request ||
    request.retried ||
    !accessToken ||
    request.sessionVersion !== sessionVersion
  ) {
    throw error;
  }

  request.retried = true;
  if (request.headers.get("Authorization") === `Bearer ${accessToken}`) {
    await refreshAccessToken();
  }

  return api.request(request);
});

export default api;
