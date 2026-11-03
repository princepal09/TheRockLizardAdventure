"use client";

import { KeyRound, LogOut, UserRound } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/auth/useLogout";
import { useChangePassword, useUpdateProfile } from "@/hooks/auth/useProfile";
import { useAuthInit } from "@/stores/useAuthInit";
import type { Admin, UpdateProfileInput } from "@/types/auth";
import { getErrorMessage } from "@/utils/error";
import { ImageUploadField, RequiredMark } from "../../_components/ImageUploadField";
import { DangerConfirmation } from "../../_components/DeleteConfirmation";

const panelClass = "space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6";
const inputClass = "block min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base focus-visible:outline-2 focus-visible:outline-tertiary";

function AccountForm({ admin }: { admin: Admin }) {
  const update = useUpdateProfile();
  const [draftName, setDraftName] = useState<string>();
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (update.isPending) return;

    const form = event.currentTarget;
    const fields = new FormData(form);
    const name = String(fields.get("name") ?? "").trim();
    const photo = fields.get("profileImage");
    const input: UpdateProfileInput = {};

    if (name.length < 2 || name.length > 100) {
      setError("Enter a name between 2 and 100 characters.");
      return;
    }
    if (name !== admin.name) input.name = name;
    if (photo instanceof File && photo.name) {
      if (!photo.size || photo.size > 5 * 1024 * 1024) {
        setError("Choose a profile photo up to 5 MB.");
        return;
      }
      input.profileImage = photo;
    }
    if (!Object.keys(input).length) {
      setError("Make a change before saving your profile.");
      return;
    }

    setError("");
    try {
      await update.mutateAsync(input);
      form.reset();
      setDraftName(undefined);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      update.reset();
    }
  }

  return (
    <form onSubmit={submit} onChange={() => setError("")} className={panelClass}>
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
        <span className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-full bg-tertiary/20 text-tertiary-foreground">
          {admin.profileImage ? (
            <Image src={admin.profileImage} alt="" width={48} height={48} unoptimized className="size-12 object-cover" />
          ) : (
            <UserRound aria-hidden="true" className="size-5" />
          )}
        </span>
        <div className="min-w-0">
          <h2 className="font-semibold text-primary">Account details</h2>
          <p className="text-sm break-all text-slate-600">{admin.email}</p>
        </div>
      </div>

      <fieldset disabled={update.isPending} className="space-y-4">
        <label className="block space-y-1.5 text-sm font-medium">
          <span>Name<RequiredMark /></span>
          <input
            name="name"
            autoComplete="name"
            minLength={2}
            maxLength={100}
            value={draftName ?? admin.name}
            onChange={(event) => setDraftName(event.target.value)}
            required
            className={inputClass}
          />
        </label>
        <ImageUploadField label={admin.profileImage ? "Replace profile photo" : "Choose a profile photo"} name="profileImage" />
      </fieldset>
      {error && <p role="alert" className="text-sm text-red-800">{error}</p>}
      <Button type="submit" variant="secondary" disabled={update.isPending}>
        {update.isPending ? "Saving…" : "Save profile"}
      </Button>
    </form>
  );
}

function PasswordForm() {
  const router = useRouter();
  const change = useChangePassword();
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (change.isPending) return;

    const form = event.currentTarget;
    const fields = new FormData(form);
    const currentPassword = String(fields.get("currentPassword") ?? "");
    const newPassword = String(fields.get("newPassword") ?? "");
    if (newPassword !== fields.get("confirmPassword")) {
      setError("The new passwords do not match.");
      return;
    }

    setError("");
    try {
      await change.mutateAsync({ currentPassword, newPassword });
      form.reset();
      router.replace("/admin/login");
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      change.reset();
    }
  }

  return (
    <form onSubmit={submit} onChange={() => setError("")} className={panelClass}>
      <div className="flex items-start gap-3 border-b border-slate-200 pb-4">
        <KeyRound aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" />
        <div>
          <h2 className="font-semibold text-primary">Change password</h2>
          <p className="mt-1 text-sm text-slate-600">Use at least 6 characters. You’ll sign in again after saving.</p>
        </div>
      </div>
      <fieldset disabled={change.isPending} className="space-y-4">
        <label className="block space-y-1.5 text-sm font-medium">
          <span>Current password<RequiredMark /></span>
          <input name="currentPassword" type="password" autoComplete="current-password" minLength={6} required className={inputClass} />
        </label>
        <label className="block space-y-1.5 text-sm font-medium">
          <span>New password<RequiredMark /></span>
          <input name="newPassword" type="password" autoComplete="new-password" minLength={6} required className={inputClass} />
        </label>
        <label className="block space-y-1.5 text-sm font-medium">
          <span>Confirm new password<RequiredMark /></span>
          <input name="confirmPassword" type="password" autoComplete="new-password" minLength={6} required className={inputClass} />
        </label>
      </fieldset>
      {error && <p role="alert" className="text-sm text-red-800">{error}</p>}
      <Button type="submit" variant="secondary" disabled={change.isPending}>
        {change.isPending ? "Changing password…" : "Change password"}
      </Button>
    </form>
  );
}

function SessionsPanel() {
  const logout = useLogout("all");

  return (
    <section className={panelClass} aria-labelledby="sessions-heading">
      <div className="flex items-start gap-3">
        <LogOut aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" />
        <div>
          <h2 id="sessions-heading" className="font-semibold text-primary">Sessions</h2>
          <p className="mt-1 text-sm text-slate-600">Sign out on every device, including this one.</p>
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
        <p className="text-xs font-semibold tracking-widest text-slate-600 uppercase">Account</p>
        <h1 className="text-3xl font-bold text-primary">My Profile</h1>
        <p className="text-sm text-slate-600">Manage your profile, password, and sessions.</p>
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
