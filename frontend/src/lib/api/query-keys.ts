export const authKeys = {
  all: ["auth"] as const,

  currentAdmin: () => [...authKeys.all, "current-admin"] as const,
};
export const enquiryKeys = {
  all: ["enquiries"] as const,
  list: (sessionVersion: number) => [...enquiryKeys.all, sessionVersion, "list"] as const,
  detail: (sessionVersion: number, id: string) =>
    [...enquiryKeys.all, sessionVersion, "detail", id] as const,
};
