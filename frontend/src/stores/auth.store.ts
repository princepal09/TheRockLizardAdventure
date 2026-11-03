import { create } from "zustand";

interface AuthState {
  accessToken: string | null;
  sessionVersion: number;
  signInNoticePending: boolean;
  endedByAdmin: boolean;
  startSession: (token: string) => void;
  setAccessToken: (token: string) => void;
  clearAuth: (endedByAdmin?: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  sessionVersion: 0,
  signInNoticePending: false,
  endedByAdmin: false,
  startSession: (accessToken) =>
    set((state) => ({
      accessToken,
      sessionVersion: state.sessionVersion + 1,
      signInNoticePending: true,
      endedByAdmin: false,
    })),
  setAccessToken: (accessToken) => set({ accessToken }),
  clearAuth: (endedByAdmin = false) =>
    set((state) => ({
      accessToken: null,
      sessionVersion: state.sessionVersion + 1,
      signInNoticePending: false,
      endedByAdmin,
    })),
}));
