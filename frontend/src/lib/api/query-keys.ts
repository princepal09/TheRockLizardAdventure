export const authKeys = {
  all: ["auth"] as const,

  currentAdmin: () => [...authKeys.all, "current-admin"] as const,
};