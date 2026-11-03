import { isAxiosError } from "axios";

type ErrorResponse = {
  message?: unknown;
  errors?: { message?: unknown }[];
};

export function getApiError(error: unknown, fallback = "Something went wrong. Try again.") {
  if (!isAxiosError<ErrorResponse>(error)) {
    return { status: undefined, message: fallback };
  }

  const status = error.response?.status;
  if (status === undefined) {
    const timedOut = error.code === "ECONNABORTED" || error.code === "ETIMEDOUT";
    return {
      status,
      message: timedOut ? "The request timed out. Try again." : "Could not reach the server. Check your connection and try again.",
    };
  }

  if (status >= 500) return { status, message: fallback };

  const body = error.response?.data;
  const validationMessage = Array.isArray(body?.errors)
    ? body.errors.find((issue) => typeof issue?.message === "string" && issue.message.trim())?.message
    : undefined;
  const message = typeof body?.message === "string" && body.message.trim()
    ? body.message.trim()
    : typeof validationMessage === "string"
      ? validationMessage.trim()
      : fallback;

  return { status, message };
}
