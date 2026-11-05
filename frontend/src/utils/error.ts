import axios from "axios";
import { ZodError } from "zod";

function formatIssue(message: string, field: unknown) {
  if (typeof field !== "string") return message;

  const label = field.replace(/([a-z])([A-Z])/g, "$1 $2");
  return `${label.charAt(0).toUpperCase()}${label.slice(1)}: ${message}`;
}

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof ZodError) {
    const issue = error.issues[0];
    return issue ? formatIssue(issue.message, issue.path[0]) : "Check the form and try again.";
  }

  if (axios.isAxiosError<{ message?: unknown; errors?: unknown }>(error)) {
    const data = error.response?.data;
    if (Array.isArray(data?.errors)) {
      const issue = data.errors.find(
        (item: unknown): item is { message: string; path?: unknown } =>
          typeof item === "object" &&
          item !== null &&
          "message" in item &&
          typeof item.message === "string" &&
          Boolean(item.message.trim()),
      );
      if (issue) {
        return formatIssue(issue.message, Array.isArray(issue.path) ? issue.path[0] : undefined);
      }
    }
    return typeof data?.message === "string" && data.message.trim()
      ? data.message
      : "Something went wrong. Please try again.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
};
