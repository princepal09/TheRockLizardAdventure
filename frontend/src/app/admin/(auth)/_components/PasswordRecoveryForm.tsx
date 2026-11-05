"use client";

import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, CircleCheck, KeyRound, Mail } from "lucide-react";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { forgotPassword, resetPassword } from "@/lib/api/auth";
import { forgotPasswordEmailSchema, resetPasswordFormSchema } from "@/types/auth";
import { getErrorMessage } from "@/utils/error";

export default function PasswordRecoveryForm({ token }: { token?: string }) {
  const isReset = token !== undefined;
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const recovery = useMutation({
    gcTime: 0,
    mutationFn: async (value: string) =>
      token === undefined
        ? forgotPassword(forgotPasswordEmailSchema.parse(value))
        : resetPassword(resetPasswordFormSchema.parse({ token, newPassword: value })),
  });

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (recovery.isPending) return;

    setError("");
    const form = event.currentTarget;
    const value = String(new FormData(form).get("value") ?? "");
    try {
      const result = await recovery.mutateAsync(value);
      form.reset();
      setMessage(result.message);
      toast.success(result.message);
    } catch (error) {
      setError(getErrorMessage(error));
      toast.error(getErrorMessage(error));
    } finally {
      recovery.reset();
    }
  }

  return (
    <section
      aria-labelledby="recovery-heading"
      className="mx-auto w-full max-w-md space-y-6 p-6 sm:p-8"
    >
      <header className="space-y-3">
        <span className="grid size-11 place-items-center rounded-xl bg-[#fff0e4] text-[#9d4300]">
          <KeyRound aria-hidden="true" className="size-5" />
        </span>
        <div className="space-y-1.5">
          <h1 id="recovery-heading" className="text-2xl leading-tight font-bold tracking-tight">
            {isReset ? "Reset password" : "Forgot your password?"}
          </h1>
          <p className="text-sm leading-6 text-[#45464d]">
            {isReset
              ? "Choose a new password for your admin account."
              : "Enter your admin email address and we’ll send you a link to reset your password."}
          </p>
        </div>
      </header>

      {message ? (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-900"
        >
          <CircleCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
          <div>
            <p className="font-semibold">{isReset ? "Password updated" : "Check your inbox"}</p>
            <p>{message}</p>
          </div>
        </div>
      ) : token === "" ? (
        <p
          role="alert"
          className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950"
        >
          This reset link is missing its token.{" "}
          <Link className="font-semibold underline" href="/admin/forgot-password">
            Request a new link
          </Link>
          .
        </p>
      ) : (
        <form className="space-y-4" noValidate onSubmit={submit}>
          <div className="space-y-2">
            <label htmlFor="recovery-value" className="block text-sm font-semibold">
              {isReset ? "New password" : "Email address"}
            </label>
            <div className="relative">
              {isReset ? (
                <KeyRound
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-[#45464d]"
                />
              ) : (
                <Mail
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-[#45464d]"
                />
              )}
              <input
                id="recovery-value"
                className="h-[50px] w-full rounded-lg border border-[#d4d8dc] bg-white pr-4 pl-11 text-base placeholder:text-sm placeholder:text-[#62646c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9d4300]"
                name="value"
                type={isReset ? "password" : "email"}
                autoComplete={isReset ? "new-password" : "username"}
                placeholder={isReset ? "Enter a new password" : "Enter your email"}
                minLength={isReset ? 8 : undefined}
                maxLength={isReset ? 100 : undefined}
                required
              />
            </div>
          </div>
          {error && (
            <p
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
            >
              {error}
            </p>
          )}
          <Button
            type="submit"
            disabled={recovery.isPending}
            className="h-[50px] w-full rounded-lg bg-[#a64200] text-sm font-semibold text-white hover:bg-[#843400]"
          >
            {recovery.isPending ? "Submitting…" : isReset ? "Reset password" : "Send reset link"}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Button>
        </form>
      )}

      <footer className="border-t border-[#e0e3e5] pt-4">
        <Link
          className="inline-flex min-h-8 items-center gap-2 rounded-sm text-sm font-semibold text-[#9d4300] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
          href="/admin/login"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back to sign in
        </Link>
      </footer>
    </section>
  );
}
