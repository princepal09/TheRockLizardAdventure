"use client";

import ModuleSkeleton from "@/components/ui/ModuleSkeleton";
import Image from "next/image";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { useSaveSiteSettings, useSiteSettings } from "@/hooks/site-settings/useSiteSettings";
import type { SiteSettings, SiteSettingsUpdate } from "@/types/site-settings";
import { siteDetailsSchema } from "@/lib/validation/admin";
import { brandingFilesSchema } from "@/lib/validation/image";
import { getErrorMessage } from "@/utils/error";
import DeleteConfirmation from "../../_components/DeleteConfirmation";
import { ImageUploadField } from "../../_components/ImageUploadField";

const panelClass = "space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6";
const inputClass = "block min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base focus-visible:outline-2 focus-visible:outline-tertiary";

type EditorProps = {
  settings: SiteSettings | null;
  pending: boolean;
  save: (input: SiteSettingsUpdate) => Promise<SiteSettings>;
};

const branding = [
  { name: "logo", key: "logoUrl", label: "Logo" },
  { name: "heroImage", key: "heroImageUrl", label: "Hero image" },
] as const;

function BrandingForm({ settings, pending, save }: EditorProps) {
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    const form = event.currentTarget;
    const selected = new FormData(form);
    const getFile = (name: string) => {
      const file = selected.get(name);
      return file instanceof File && file.name ? file : undefined;
    };

    setError("");
    try {
      const { logo, heroImage } = brandingFilesSchema.parse({
        logo: getFile("logo"),
        heroImage: getFile("heroImage"),
      });
      const upload = new FormData();
      if (logo) upload.set("logo", logo);
      if (heroImage) upload.set("heroImage", heroImage);
      await save(upload);
      form.reset();
    } catch (error) {
      setError(getErrorMessage(error));
    }
  }

  return (
    <form noValidate onSubmit={submit} onChange={() => setError("")} className={panelClass}>
      <div>
        <h2 className="font-semibold text-primary">Branding</h2>
        <p className="mt-1 text-sm text-slate-600">Update the site logo and homepage hero image.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {branding.map(({ name, key, label }) => {
          const image = settings?.[key];
          return (
            <div key={key} className="min-w-0 space-y-3 rounded-lg border border-slate-200 p-4">
              <h3 className="text-sm font-semibold text-primary">{label}</h3>
              {image ? (
                <div className="relative aspect-video overflow-hidden rounded-lg bg-slate-100">
                  <Image
                    src={image}
                    alt={`Current ${label.toLowerCase()}`}
                    fill
                    unoptimized
                    className={name === "logo" ? "object-contain p-4" : "object-cover"}
                  />
                </div>
              ) : (
                <p className="text-sm text-slate-600">No {label.toLowerCase()} uploaded.</p>
              )}
              <ImageUploadField label={image ? `Replace ${label.toLowerCase()}` : `Choose ${label.toLowerCase()}`} name={name} disabled={pending} />
              {image && (
                <DeleteConfirmation
                  label={`Remove ${label.toLowerCase()}`}
                  title={`Remove ${label.toLowerCase()}?`}
                  description={`This ${label.toLowerCase()} will be removed from the site settings.`}
                  disabled={pending}
                  onConfirm={() => save({ [key]: null })}
                />
              )}
            </div>
          );
        })}
      </div>
      {error && <p role="alert" className="text-sm text-red-800">{error}</p>}
      <Button type="submit" variant="secondary" disabled={pending}>Save branding</Button>
    </form>
  );
}

const contactFields = [
  { name: "contactEmail", label: "Contact email", type: "email", maxLength: 255 },
  { name: "contactPhone", label: "Contact phone", type: "tel", maxLength: 30 },
  { name: "whatsappPhone", label: "WhatsApp phone", type: "tel", maxLength: 16 },
] as const;

const socialFields = [
  { name: "facebookUrl", label: "Facebook" },
  { name: "instagramUrl", label: "Instagram" },
  { name: "youtubeUrl", label: "YouTube" },
] as const;

const detailFields = [...contactFields, ...socialFields, { name: "address" }] as const;

function DetailsForm({ settings, pending, save }: EditorProps) {
  const [draft, setDraft] = useState<Partial<SiteSettings>>({});
  const [error, setError] = useState("");
  const changes: Partial<SiteSettings> = {};

  for (const { name } of detailFields) {
    if (draft[name] === undefined) continue;
    const value = draft[name]?.trim() || null;
    if (value !== (settings?.[name] ?? null)) changes[name] = value;
  }

  function change(name: keyof SiteSettings, value: string) {
    setDraft((previous) => ({ ...previous, [name]: value }));
    setError("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending || !Object.keys(changes).length) return;

    setError("");
    try {
      await save(siteDetailsSchema.parse(changes));
      setDraft({});
    } catch (error) {
      setError(getErrorMessage(error));
    }
  }

  return (
    <form noValidate onSubmit={submit} className={panelClass}>
      <fieldset disabled={pending} className="space-y-4">
        <legend className="font-semibold text-primary">Contact details</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          {contactFields.map(({ name, label, type, maxLength }) => (
            <label key={name} className="block space-y-1.5 text-sm font-medium">
              <span>{label}</span>
              <input
                type={type}
                name={name}
                maxLength={maxLength}
                pattern={name === "whatsappPhone" ? "\\+[1-9][0-9]{7,14}" : undefined}
                value={draft[name] ?? settings?.[name] ?? ""}
                onChange={(event) => change(name, event.target.value)}
                className={inputClass}
              />
              {name === "whatsappPhone" && <span className="block text-xs text-slate-600">Use international format, such as +919876543210.</span>}
            </label>
          ))}
        </div>
        <label className="block space-y-1.5 text-sm font-medium">
          <span>Address</span>
          <textarea
            name="address"
            rows={3}
            maxLength={5000}
            value={draft.address ?? settings?.address ?? ""}
            onChange={(event) => change("address", event.target.value)}
            className={inputClass}
          />
        </label>
      </fieldset>

      <fieldset disabled={pending} className="space-y-4 border-t border-slate-200 pt-4">
        <legend className="font-semibold text-primary">Social links</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          {socialFields.map(({ name, label }) => (
            <label key={name} className="block space-y-1.5 text-sm font-medium">
              <span>{label}</span>
              <input
                name={name}
                type="url"
                maxLength={500}
                placeholder="https://"
                value={draft[name] ?? settings?.[name] ?? ""}
                onChange={(event) => change(name, event.target.value)}
                className={inputClass}
              />
            </label>
          ))}
        </div>
      </fieldset>

      {error && <p role="alert" className="text-sm text-red-800">{error}</p>}
      <Button type="submit" variant="secondary" disabled={pending || !Object.keys(changes).length}>
        Save contact and social details
      </Button>
    </form>
  );
}

export default function SiteSettingsManager() {
  const settings = useSiteSettings();
  const save = useSaveSiteSettings();

  return (
    <section className="mx-auto max-w-6xl space-y-6">
      <header className="space-y-1">
        <p className="text-xs font-semibold tracking-widest text-slate-600 uppercase">Website</p>
        <h1 className="text-3xl font-bold text-primary">Site Settings</h1>
        <p className="text-sm text-slate-600">Manage your public branding, contact details, and social links.</p>
      </header>
      {settings.data !== undefined ? (
        <>
          <BrandingForm settings={settings.data} pending={save.isPending} save={save.mutateAsync} />
          <DetailsForm settings={settings.data} pending={save.isPending} save={save.mutateAsync} />
        </>
      ) : settings.isError ? (
        <div className={panelClass}>
          <p role="alert" className="text-sm text-red-800">{getErrorMessage(settings.error)}</p>
          <Button type="button" variant="outline" disabled={settings.isFetching} onClick={() => void settings.refetch()}>Retry</Button>
        </div>
      ) : (
        <ModuleSkeleton label="Loading site settings" variant="form" />
      )}
    </section>
  );
}
