"use client";

import ModuleSkeleton from "@/components/ui/ModuleSkeleton";
import { Plus, UserRound } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import {
  useTeamMember,
  useTeamMembers,
  useTeamMutation,
} from "@/hooks/team/useTeam";
import { deleteTeamMember, saveTeamMember } from "@/lib/api/team";
import type { TeamMember, TeamMemberInput } from "@/types/team";
import { teamMemberFormSchema } from "@/lib/validation/admin";
import { imageFileSchema } from "@/lib/validation/image";
import { getErrorMessage } from "@/utils/error";
import DeleteConfirmation from "../../_components/DeleteConfirmation";
import {
  ImageUploadField,
  RequiredMark,
} from "../../_components/ImageUploadField";

const panelClass = "rounded-xl border border-slate-200 bg-white shadow-sm";
const inputClass =
  "block min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base focus-visible:outline-2 focus-visible:outline-tertiary";

function TeamMemberForm({
  member,
  onClose,
}: {
  member?: TeamMember;
  onClose: () => void;
}) {
  const save = useTeamMutation(
    async ({ input, photo }: { input: TeamMemberInput; photo?: File }) =>
      saveTeamMember(
        member?.id,
        teamMemberFormSchema.parse(input),
        imageFileSchema.optional().parse(photo),
      ),
    member ? "Team member updated" : "Team member created",
    member?.id,
  );
  const remove = useTeamMutation(
    deleteTeamMember,
    "Team member deleted",
    member?.id,
  );
  const busy = save.isPending || remove.isPending;
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;

    const form = new FormData(event.currentTarget);
    const text = (name: string) => String(form.get(name) ?? "").trim();
    const file = form.get("photo");

    save.mutate(
      {
        input: {
          name: text("name"),
          role: text("role"),
          bio: text("bio") || null,
          qualifications: text("qualifications") || null,
          sortOrder: Number(text("sortOrder") || NaN),
          isActive: form.has("isActive"),
        },
        photo: file instanceof File && file.name ? file : undefined,
      },
      { onSuccess: onClose },
    );
  }

  return (
    <form
      noValidate
      onSubmit={submit}
      className={`${panelClass} space-y-4 p-5 sm:p-6`}
    >
      <header className="border-b border-slate-200 pb-4">
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="scroll-mt-24 text-lg font-semibold text-primary"
        >
          {member ? "Edit team member" : "New team member"}
        </h2>
        <p className="mt-1 text-xs text-slate-600">
          <RequiredMark /> Required field
        </p>
      </header>
      <fieldset disabled={busy} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-1.5 text-sm font-medium">
            <span>
              Name
              <RequiredMark />
            </span>
            <input
              className={inputClass}
              name="name"
              maxLength={150}
              defaultValue={member?.name}
              required
            />
          </label>
          <label className="block space-y-1.5 text-sm font-medium">
            <span>
              Role
              <RequiredMark />
            </span>
            <input
              className={inputClass}
              name="role"
              maxLength={100}
              defaultValue={member?.role}
              required
            />
          </label>
        </div>
        <label className="block space-y-1.5 text-sm font-medium">
          <span>Bio</span>
          <textarea
            className={inputClass}
            name="bio"
            rows={4}
            maxLength={1500}
            defaultValue={member?.bio ?? ""}
          />
        </label>
        <label className="block space-y-1.5 text-sm font-medium">
          <span>Qualifications</span>
          <textarea
            className={inputClass}
            name="qualifications"
            rows={3}
            maxLength={500}
            defaultValue={member?.qualifications ?? ""}
          />
        </label>
        {member?.photoUrl && (
          <Image
            src={member.photoUrl}
            alt="Current team member photo"
            width={128}
            height={128}
            unoptimized
            className="size-24 rounded-lg object-cover"
          />
        )}
        <ImageUploadField
          label={member?.photoUrl ? "Replace photo" : "Profile photo"}
          name="photo"
        />
        <div className="grid items-end gap-4 sm:grid-cols-2">
          <label className="block space-y-1.5 text-sm font-medium">
            <span>
              Display order
              <RequiredMark />
            </span>
            <input
              className={inputClass}
              name="sortOrder"
              type="number"
              min={0}
              max={2147483647}
              defaultValue={member?.sortOrder ?? 0}
              required
            />
          </label>
          <label className="flex min-h-11 items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked={member?.isActive ?? false}
            />
            Show on the public team page
          </label>
        </div>
      </fieldset>
      {save.error && (
        <p role="alert" className="text-sm text-red-800">
          {getErrorMessage(save.error)}
        </p>
      )}
      <div className="flex flex-wrap gap-2 border-t border-slate-200 pt-4">
        <Button type="submit" variant="secondary" disabled={busy}>
          {save.isPending
            ? "Saving…"
            : member
              ? "Save changes"
              : "Create team member"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={busy}
        >
          Cancel
        </Button>
        {member && (
          <DeleteConfirmation
            label="Delete"
            title="Delete team member?"
            description={`“${member.name}” will be permanently removed from the team.`}
            disabled={busy}
            onConfirm={async () => {
              await remove.mutateAsync(member.id);
              onClose();
            }}
          />
        )}
      </div>
    </form>
  );
}

export default function TeamManager() {
  const [editor, setEditor] = useState<string>();
  const members = useTeamMembers();
  const detail = useTeamMember(editor === "new" ? undefined : editor);
  const closeEditor = () =>
    setEditor((current) => (current === editor ? undefined : current));

  return (
    <section className="mx-auto max-w-6xl space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold tracking-widest text-slate-600 uppercase">
            Website
          </p>
          <h1 className="text-3xl font-bold text-primary">Team</h1>
          <p className="text-sm text-slate-600">
            Manage the people featured on your public team page.
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="lg"
          onClick={() => setEditor("new")}
        >
          <Plus aria-hidden="true" />
          New team member
        </Button>
      </header>

      <div
        className={editor ? "grid items-start gap-5 lg:grid-cols-2" : undefined}
      >
        {editor && (
          <div className="min-w-0 lg:order-last">
            {editor === "new" || detail.data ? (
              <TeamMemberForm
                key={editor}
                member={editor === "new" ? undefined : detail.data}
                onClose={closeEditor}
              />
            ) : detail.isError ? (
              <div className={`${panelClass} space-y-3 p-5`}>
                <p role="alert" className="text-sm text-red-800">
                  {getErrorMessage(detail.error)}
                </p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={detail.isFetching}
                    onClick={() => void detail.refetch()}
                  >
                    Retry
                  </Button>
                  <Button type="button" variant="outline" onClick={closeEditor}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <ModuleSkeleton label="Loading team member" variant="form" />
            )}
          </div>
        )}

        <div className={panelClass}>
          {members.isPending ? (
            <ModuleSkeleton label="Loading team members" />
          ) : members.isError ? (
            <div className="space-y-3 p-5">
              <p role="alert" className="text-sm text-red-800">
                {getErrorMessage(members.error)}
              </p>
              <Button
                type="button"
                variant="outline"
                disabled={members.isFetching}
                onClick={() => void members.refetch()}
              >
                Retry
              </Button>
            </div>
          ) : members.data.length ? (
            <ul className="divide-y divide-slate-200">
              {members.data.map((member) => (
                <li key={member.id}>
                  <button
                    type="button"
                    aria-pressed={editor === member.id}
                    onClick={() => setEditor(member.id)}
                    className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left hover:bg-slate-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-tertiary aria-pressed:bg-tertiary/10 sm:px-5"
                  >
                    {member.photoUrl ? (
                      <Image
                        src={member.photoUrl}
                        alt=""
                        width={44}
                        height={44}
                        unoptimized
                        className="size-11 shrink-0 rounded-lg object-cover"
                      />
                    ) : (
                      <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-tertiary/20 text-primary">
                        <UserRound aria-hidden="true" className="size-5" />
                      </span>
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold break-words text-primary">
                        {member.name}
                      </span>
                      <span className="block text-sm break-words text-slate-600">
                        {member.role}
                      </span>
                    </span>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${member.isActive ? "bg-tertiary/20 text-tertiary-foreground" : "bg-slate-100 text-slate-700"}`}
                    >
                      {member.isActive ? "Visible" : "Hidden"}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-5 text-sm text-slate-600">No team members yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}
