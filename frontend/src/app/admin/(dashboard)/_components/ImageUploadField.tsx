"use client";

import { ImageUp, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export function RequiredMark() {
  return (
    <span aria-hidden="true" className="ml-1 text-orange-700">
      *
    </span>
  );
}

function previewFiles(files: FileList | null) {
  return Array.from(files ?? [], (file) => ({
    name: file.name,
    url: URL.createObjectURL(file),
  }));
}

export function ImageUploadField({
  label,
  name,
  multiple,
  required,
  disabled,
  onFilesChange,
}: {
  label: string;
  name: string;
  multiple?: boolean;
  required?: boolean;
  disabled?: boolean;
  onFilesChange?: (files: FileList | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<ReturnType<typeof previewFiles>>([]);
  const [selectionLimited, setSelectionLimited] = useState(false);

  useEffect(() => {
    const form = inputRef.current?.form;
    const clearPreview = () => {
      setPreviews([]);
      setSelectionLimited(false);
    };
    form?.addEventListener("reset", clearPreview);
    return () => form?.removeEventListener("reset", clearPreview);
  }, []);

  useEffect(
    () => () => {
      previews.forEach(({ url }) => URL.revokeObjectURL(url));
    },
    [previews],
  );

  function cancelSelection(index: number) {
    const input = inputRef.current;
    if (!input?.files) return;

    if (input.files.length === 1) {
      input.value = "";
    } else {
      const remaining = new DataTransfer();
      Array.from(input.files).forEach((file, fileIndex) => {
        if (fileIndex !== index) remaining.items.add(file);
      });
      input.files = remaining.files;
    }

    setPreviews(previewFiles(input.files));
    onFilesChange?.(input.files);
    setSelectionLimited(false);
    input.focus();
  }

  return (
    <div className="space-y-3">
      <label className="flex min-w-0 items-start gap-3 rounded-xl border border-dashed border-sky-300 bg-tertiary/5 p-4 transition-colors hover:bg-tertiary/10 focus-within:border-tertiary">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-tertiary/20 text-tertiary-foreground">
          <ImageUp aria-hidden="true" className="size-5" />
        </span>
        <span className="min-w-0 flex-1 space-y-1">
          <span className="block text-sm font-semibold text-primary">
            {label}
            {required && <RequiredMark />}
          </span>
          <span className="block text-xs text-slate-600">
            JPEG, PNG, WebP, or GIF · {multiple ? "Up to 5 images, 5 MB each" : "Up to 5 MB"}
          </span>
          <input
            ref={inputRef}
            type="file"
            name={name}
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple={multiple}
            required={required}
            disabled={disabled}
            onChange={(event) => {
              const input = event.currentTarget;
              const overLimit = Boolean(multiple && (input.files?.length ?? 0) > 5);
              if (overLimit) {
                input.value = "";
              }
              setSelectionLimited(overLimit);
              setPreviews(previewFiles(input.files));
              onFilesChange?.(input.files);
            }}
            className="mt-2 block w-full rounded-md text-sm text-slate-600 file:mr-2 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:text-xs file:font-semibold file:text-primary-foreground focus-visible:outline-2 focus-visible:outline-tertiary disabled:opacity-60"
          />
        </span>
      </label>
      {selectionLimited && (
        <p role="status" className="text-sm text-slate-600">
          Select up to 5 photos at a time. Please choose your photos again.
        </p>
      )}
      {previews.length > 0 && (
        <ul aria-label="Selected images" className="space-y-2">
          {previews.map((preview, index) => (
            <li
              key={preview.url}
              className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-3"
            >
              <Image
                src={preview.url}
                alt=""
                width={96}
                height={64}
                unoptimized
                className="h-16 w-24 rounded-lg object-cover"
              />
              <p className="min-w-0 flex-1 break-all text-sm font-medium text-primary">
                {preview.name}
              </p>
              <button
                type="button"
                disabled={disabled}
                aria-label={multiple ? `Remove ${preview.name} from selection` : undefined}
                onClick={() => cancelSelection(index)}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold text-primary hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-tertiary disabled:opacity-60"
              >
                <X aria-hidden="true" className="size-4" />
                {multiple ? "Remove" : "Cancel selection"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
