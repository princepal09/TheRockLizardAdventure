"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { galleryFilesSchema } from "@/lib/validation/image";
import { getErrorMessage } from "@/utils/error";
import { ImageUploadField } from "./ImageUploadField";

export default function GalleryUploadForm({
  upload,
  pending,
  error,
}: {
  upload: (files: File[]) => Promise<void>;
  pending: boolean;
  error: Error | null;
}) {
  const [validationError, setValidationError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    const form = event.currentTarget;
    const files = new FormData(form)
      .getAll("images")
      .filter((file): file is File => file instanceof File && Boolean(file.name));
    const result = galleryFilesSchema.safeParse(files);
    if (!result.success) {
      setValidationError(getErrorMessage(result.error));
      return;
    }

    setValidationError("");
    try {
      await upload(result.data);
      form.reset();
    } catch {
      // The mutation error is shown below the picker.
    }
  }

  return (
    <form
      noValidate
      onSubmit={submit}
      onChange={() => setValidationError("")}
      className="space-y-3 rounded-xl border border-slate-200 bg-white p-4"
    >
      <ImageUploadField
        label="Choose gallery photos"
        name="images"
        multiple
        required
        disabled={pending}
      />
      {(validationError || error) && (
        <p role="alert" className="text-sm text-red-800">
          {validationError || getErrorMessage(error)}
        </p>
      )}
      <Button type="submit" variant="secondary" disabled={pending}>
        {pending ? "Uploading…" : "Upload photos"}
      </Button>
    </form>
  );
}
