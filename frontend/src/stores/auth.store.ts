import { create } from "zustand";

interface AuthState {
  accessToken: string | null;
  sessionVersion: number;
  startSession: (token: string) => void;
  setAccessToken: (token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  sessionVersion: 0,
  startSession: (accessToken) =>
    set((state) => ({ accessToken, sessionVersion: state.sessionVersion + 1 })),
  setAccessToken: (accessToken) => set({ accessToken }),
  clearAuth: () =>
    set((state) => ({
      accessToken: null,
      sessionVersion: state.sessionVersion + 1,
    })),
}));
