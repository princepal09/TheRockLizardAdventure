"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, LogOut, UserRound } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/auth/useLogout";
import { useChangePassword, useUpdateProfile } from "@/hooks/auth/useProfile";
import { useAuthInit } from "@/stores/useAuthInit";
import {
  changePasswordSchema,
  profileSchema,
  type Admin,
  type ChangePasswordFormValues,
  type ProfileFormValues,
} from "@/types/auth";
import { getErrorMessage } from "@/utils/error";
import {
  ImageUploadField,
  RequiredMark,
} from "../../_components/ImageUploadField";
import { DangerConfirmation } from "../../_components/DeleteConfirmation";

const panelClass =
  "space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6";
const inputClass =
  "block min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base focus-visible:outline-2 focus-visible:outline-tertiary";

function AccountForm({ admin }: { admin: Admin }) {
  const update = useUpdateProfile();
  const { register, handleSubmit, setValue, setError, reset, formState: { errors, isSubmitting } } =
    useForm<ProfileFormValues>({
      resolver: zodResolver(profileSchema),
      defaultValues: { name: admin.name },
    });

  const submit = handleSubmit(async ({ name, profileImage }, event) => {
    if (name === admin.name && !profileImage) {
      setError("root.server", { message: "Make a change before saving your profile." });
      return;
    }

    try {
      const { admin: savedAdmin } = await update.mutateAsync({
        name: name === admin.name ? undefined : name,
        profileImage,
      });
      if (event?.target instanceof HTMLFormElement) event.target.reset();
      reset({ name: savedAdmin.name });
    } catch (error) {
      setError("root.server", { message: getErrorMessage(error) });
    } finally {
      update.reset();
    }
  });

  return (
    <form
      noValidate
      onSubmit={submit}
      className={panelClass}
    >
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
        <span className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-full bg-tertiary/20 text-tertiary-foreground">
          {admin.profileImage ? (
            <Image
              src={admin.profileImage}
              alt=""
              width={48}
              height={48}
              unoptimized
              className="size-12 object-cover"
            />
          ) : (
            <UserRound aria-hidden="true" className="size-5" />
          )}
        </span>
        <div className="min-w-0">
          <h2 className="font-semibold text-primary">Account details</h2>
          <p className="text-sm break-all text-slate-600">{admin.email}</p>
        </div>
      </div>

      <fieldset disabled={isSubmitting} className="space-y-4">
        <label className="block space-y-1.5 text-sm font-medium">
          <span>
            Name
            <RequiredMark />
          </span>
          <input
            autoComplete="name"
            required
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "profile-name-error" : undefined}
            className={inputClass}
            {...register("name")}
          />
          {errors.name && <span id="profile-name-error" role="alert" className="block text-sm text-red-800">{errors.name.message}</span>}
        </label>
        <ImageUploadField
          label={
            admin.profileImage
              ? "Replace profile photo"
              : "Choose a profile photo"
          }
          name="profileImage"
          onFilesChange={(files) => setValue("profileImage", files?.[0], { shouldDirty: true, shouldValidate: true })}
        />
        {errors.profileImage && <p role="alert" className="text-sm text-red-800">{errors.profileImage.message}</p>}
      </fieldset>
      {errors.root?.server?.message && (
        <p role="alert" className="text-sm text-red-800">
          {errors.root.server.message}
        </p>
      )}
      <Button type="submit" variant="secondary" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : "Save profile"}
      </Button>
    </form>
  );
}

function PasswordForm() {
  const router = useRouter();
  const change = useChangePassword();
  const { register, handleSubmit, setError, reset, formState: { errors, isSubmitting } } =
    useForm<ChangePasswordFormValues>({
      resolver: zodResolver(changePasswordSchema),
      defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
    });

  const submit = handleSubmit(async ({ currentPassword, newPassword }) => {
    try {
      await change.mutateAsync({ currentPassword, newPassword });
      reset();
      router.replace("/admin/login");
    } catch (error) {
      setError("root.server", { message: getErrorMessage(error) });
    } finally {
      change.reset();
    }
  });

  return (
    <form
      onSubmit={submit}
      noValidate
      className={panelClass}
    >
      <div className="flex items-start gap-3 border-b border-slate-200 pb-4">
        <KeyRound
          aria-hidden="true"
          className="mt-0.5 size-5 shrink-0 text-primary"
        />
        <div>
          <h2 className="font-semibold text-primary">Change password</h2>
          <p className="mt-1 text-sm text-slate-600">
            Use at least 6 characters. You’ll sign in again after saving.
          </p>
        </div>
      </div>
      <fieldset disabled={isSubmitting} className="space-y-4">
        <label className="block space-y-1.5 text-sm font-medium">
          <span>
            Current password
            <RequiredMark />
          </span>
          <input
            type="password"
            autoComplete="current-password"
            required
            aria-invalid={Boolean(errors.currentPassword)}
            aria-describedby={errors.currentPassword ? "current-password-error" : undefined}
            className={inputClass}
            {...register("currentPassword")}
          />
          {errors.currentPassword && <span id="current-password-error" role="alert" className="block text-sm text-red-800">{errors.currentPassword.message}</span>}
        </label>
        <label className="block space-y-1.5 text-sm font-medium">
          <span>
            New password
            <RequiredMark />
          </span>
          <input
            type="password"
            autoComplete="new-password"
            required
            aria-invalid={Boolean(errors.newPassword)}
            aria-describedby={errors.newPassword ? "new-password-error" : undefined}
            className={inputClass}
            {...register("newPassword")}
          />
          {errors.newPassword && <span id="new-password-error" role="alert" className="block text-sm text-red-800">{errors.newPassword.message}</span>}
        </label>
        <label className="block space-y-1.5 text-sm font-medium">
          <span>
            Confirm new password
            <RequiredMark />
          </span>
          <input
            type="password"
            autoComplete="new-password"
            required
            aria-invalid={Boolean(errors.confirmPassword)}
            aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
            className={inputClass}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && <span id="confirm-password-error" role="alert" className="block text-sm text-red-800">{errors.confirmPassword.message}</span>}
        </label>
      </fieldset>
      {errors.root?.server?.message && (
        <p role="alert" className="text-sm text-red-800">
          {errors.root.server.message}
        </p>
      )}
      <Button type="submit" variant="secondary" disabled={isSubmitting}>
        {isSubmitting ? "Changing password…" : "Change password"}
      </Button>
    </form>
  );
}

function SessionsPanel() {
  const logout = useLogout("all");

  return (
    <section className={panelClass} aria-labelledby="sessions-heading">
      <div className="flex items-start gap-3">
        <LogOut
          aria-hidden="true"
          className="mt-0.5 size-5 shrink-0 text-primary"
        />
        <div>
          <h2 id="sessions-heading" className="font-semibold text-primary">
            Sessions
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Sign out on every device, including this one.
          </p>
        </div>
      </div>
      <DangerConfirmation
        label="Sign out everywhere"
        title="Sign out on all devices?"
        description="You’ll need to sign in again on this device and any other device where you’re signed in."
        confirmLabel="Sign out everywhere"
        pendingLabel="Signing out…"
        icon={LogOut}
        filledTrigger
        disabled={logout.isPending}
        onConfirm={() => logout.mutateAsync()}
      />
    </section>
  );
}

export default function ProfileManager() {
  const { data: admin } = useAuthInit();

  if (!admin) return null;

  return (
    <section className="mx-auto max-w-6xl space-y-6">
      <header className="space-y-1">
        <p className="text-xs font-semibold tracking-widest text-slate-600 uppercase">
          Account
        </p>
        <h1 className="text-3xl font-bold text-primary">My Profile</h1>
        <p className="text-sm text-slate-600">
          Manage your profile, password, and sessions.
        </p>
      </header>
      <div className="grid items-start gap-5 lg:grid-cols-2">
        <div className="space-y-5">
          <AccountForm key={admin.id} admin={admin} />
          <SessionsPanel />
        </div>
        <PasswordForm />
      </div>
    </section>
  );
}
