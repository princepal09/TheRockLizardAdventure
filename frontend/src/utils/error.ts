import axios from "axios";
import { ZodError } from "zod";

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof ZodError) {
    const issue = error.issues[0];
    const field = issue?.path[0];
    if (!issue) return "Check the form and try again.";
    if (typeof field !== "string") return issue.message;

    const label = field.replace(/([a-z])([A-Z])/g, "$1 $2");
    return `${label.charAt(0).toUpperCase()}${label.slice(1)}: ${issue.message}`;
  }

  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message || "Something went wrong. Please try again."
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
};
