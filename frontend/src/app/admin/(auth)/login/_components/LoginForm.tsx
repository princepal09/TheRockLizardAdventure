"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { getApiError } from "@/lib/api/error";
import { loginSchema, type LoginFormValues } from "@/types/auth";

const inputClassName =
  "h-[50px] w-full rounded-lg placeholder:text-sm  border border-[#e0e3e5]/60 bg-white px-4 pl-[45px] text-base text-[#191c1e] placeholder:text-[#45464d]/75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tertiary";

const fieldIconClassName =
  "pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-[#45464d]";

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const PasswordIcon = showPassword ? EyeOff : Eye;
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  // useEffect(() => {
  //   if (state.status === "authenticated") router.replace("/admin/dashboard");
  // }, [router, state.status]);

  // async function submitHandler(data: LoginFormValues) {
  //   if (state.status === "loading" || state.status === "authenticated") return;

  //   try {
  //     await signIn(data);
  //     toast.success("Signed in successfully.");
  //   } catch (error) {
  //     const { message } = getApiError(error, "Could not sign in. Try again.");
  //     setError("root.server", { message });
  //     toast.error(message);
  //   }
  // }

  const submitHandler = async(data:LoginFormValues) => {
    console.log(data)

  }

  return (
    <form
      className="min-w-0 space-y-4"
      noValidate
      onSubmit={handleSubmit(submitHandler)}
    >
      <div className="space-y-1.5">
        <label
          htmlFor="email"
          className="block text-[13px] leading-[18px] font-semibold"
        >
          Email Address
        </label>
        <div className="relative">
          <Mail aria-hidden="true" className={fieldIconClassName} />
          <input
            id="email"
            type="email"
            autoComplete="username"
            placeholder="Enter your email"
            required
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "login-email-error" : undefined}
            className={inputClassName}
            {...register("email")}
          />
        </div>
        {errors.email && (
          <p
            id="login-email-error"
            role="alert"
            className="text-sm text-red-700"
          >
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <div className="flex flex-wrap items-baseline justify-between gap-x-2 text-[13px] leading-[18px]">
          <label htmlFor="password" className="font-semibold">
            Password
          </label>
          <Link
            href="/admin/forgot-password"
            className="inline-flex min-h-6 items-center font-semibold text-[#9d4300] underline-offset-4 hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <LockKeyhole aria-hidden="true" className={fieldIconClassName} />
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your password"
            required
            aria-invalid={Boolean(errors.password)}
            aria-describedby={
              errors.password ? "login-password-error" : undefined
            }
            className={`${inputClassName} pr-[45px]`}
            {...register("password")}
          />
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-controls="password"
            onClick={() => setShowPassword((visible) => !visible)}
            className="absolute inset-y-0 right-0 grid w-11 place-items-center rounded-r-lg text-[#45464d] focus-visible:outline-2 focus-visible:outline-tertiary"
          >
            <PasswordIcon aria-hidden="true" className="size-4" />
          </button>
        </div>
        {errors.password && (
          <p
            id="login-password-error"
            role="alert"
            className="text-sm text-red-700"
          >
            {errors.password.message}
          </p>
        )}
      </div>

      {errors.root?.server?.message && (
        <p role="alert" className="text-sm text-red-700">
          {errors.root.server.message}
        </p>
      )}

      <Button
        type="submit"
        className="h-[50px] w-full cursor-pointer gap-2 rounded-lg bg-[#fd761a] text-[13px] font-bold text-[#ffffff] shadow-[0_6px_12px_#fd761a40] hover:bg-[#b54708]"
      >
        {isSubmitting ? "Signing in…" : "Sign In"}
        <ArrowRight aria-hidden="true" className="size-3" />
      </Button>
    </form>
  );
}
