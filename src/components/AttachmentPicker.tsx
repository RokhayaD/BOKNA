"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import {
  ATTACHMENT_ACCEPTED_TYPES,
  ATTACHMENT_MAX_FILES,
  ATTACHMENT_MAX_TOTAL_BYTES,
  formatBytes,
  isImageType,
} from "@/lib/attachments";

export type PickedFile = { id: string; file: File; preview: string | null };

const MAX_IMAGE_SIDE = 1600;

// Réduit les photos (1600 px max, JPEG) pour rester sous le plafond d'envoi.
async function compressImage(file: File): Promise<File> {
  if (!isImageType(file.type)) return file;
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return file;

  const scale = Math.min(1, MAX_IMAGE_SIDE / Math.max(bitmap.width, bitmap.height));
  if (scale === 1 && file.size < 500 * 1024) return file;

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.82));
  if (!blob || blob.size >= file.size) return file;
  return new File([blob], `${file.name.replace(/\.[^.]+$/, "")}.jpg`, { type: "image/jpeg" });
}

export function AttachmentPicker({
  files,
  onChange,
}: {
  files: PickedFile[];
  onChange: (files: PickedFile[]) => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);

  // Libère les aperçus encore affichés quand le formulaire disparaît.
  const filesRef = useRef(files);
  useEffect(() => {
    filesRef.current = files;
  }, [files]);
  useEffect(() => () => filesRef.current.forEach((f) => f.preview && URL.revokeObjectURL(f.preview)), []);

  const totalSize = files.reduce((sum, f) => sum + f.file.size, 0);

  async function addFiles(list: FileList | null) {
    if (!list || list.length === 0) return;
    setError(null);

    const incoming = [...list];
    const rejected = incoming.filter((f) => !ATTACHMENT_ACCEPTED_TYPES.includes(f.type));
    const accepted = incoming.filter((f) => ATTACHMENT_ACCEPTED_TYPES.includes(f.type));
    const room = ATTACHMENT_MAX_FILES - files.length;

    if (rejected.length) setError("Formats acceptés : JPEG, PNG, WebP et PDF.");
    if (accepted.length > room) {
      setError(`Vous pouvez joindre au maximum ${ATTACHMENT_MAX_FILES} fichiers.`);
    }

    setBusy(true);
    const processed = await Promise.all(accepted.slice(0, Math.max(0, room)).map(compressImage));
    setBusy(false);

    let size = totalSize;
    const next: PickedFile[] = [];
    for (const file of processed) {
      if (size + file.size > ATTACHMENT_MAX_TOTAL_BYTES) {
        setError(`« ${file.name} » dépasse la taille totale autorisée (${formatBytes(ATTACHMENT_MAX_TOTAL_BYTES)}).`);
        continue;
      }
      size += file.size;
      next.push({
        id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2)}`,
        file,
        preview: isImageType(file.type) ? URL.createObjectURL(file) : null,
      });
    }
    if (next.length) onChange([...files, ...next]);
  }

  function remove(id: string) {
    const target = files.find((f) => f.id === id);
    if (target?.preview) URL.revokeObjectURL(target.preview);
    onChange(files.filter((f) => f.id !== id));
    setError(null);
  }

  const full = files.length >= ATTACHMENT_MAX_FILES;

  return (
    <div className="space-y-3">
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (!full) addFiles(e.dataTransfer.files);
        }}
        className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-7 text-center transition has-focus-visible:ring-4 has-focus-visible:ring-brand-600/15 ${
          full
            ? "cursor-not-allowed border-stone-200 bg-stone-50 opacity-60"
            : dragging
              ? "cursor-copy border-brand-600 bg-brand-50"
              : "cursor-pointer border-stone-300 bg-white hover:border-brand-600 hover:bg-brand-50/40"
        }`}
      >
        <input
          type="file"
          multiple
          disabled={full || busy}
          accept={ATTACHMENT_ACCEPTED_TYPES.join(",")}
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
          className="sr-only"
        />
        <span className="flex size-10 items-center justify-center rounded-full bg-brand-50 text-brand-700 ring-1 ring-brand-700/10">
          <Icon name="upload" className="size-5" />
        </span>
        <span className="mt-3 text-sm font-semibold text-ink">
          {busy ? "Préparation des fichiers…" : full ? "Nombre maximum de fichiers atteint" : "Ajouter des photos ou des documents"}
        </span>
        <span className="mt-1 text-xs text-stone-500">
          Cliquez ou glissez-déposez · JPEG, PNG, WebP ou PDF · {ATTACHMENT_MAX_FILES} fichiers,{" "}
          {formatBytes(ATTACHMENT_MAX_TOTAL_BYTES)} au total
        </span>
      </label>

      {error && (
        <p role="alert" className="flex items-center gap-2 text-sm text-red-700">
          <Icon name="alert-circle" className="size-4 shrink-0" />
          {error}
        </p>
      )}

      {files.length > 0 && (
        <div>
          <ul className="grid gap-2 sm:grid-cols-2">
            {files.map(({ id, file, preview }) => (
              <li key={id} className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white p-2 pr-2.5">
                {preview ? (
                  // eslint-disable-next-line @next/next/no-img-element -- aperçu local (blob:)
                  <img src={preview} alt="" className="size-12 shrink-0 rounded-lg object-cover ring-1 ring-stone-900/5" />
                ) : (
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-accent-50 text-accent-700">
                    <Icon name="file" className="size-5" />
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-ink">{file.name}</span>
                  <span className="block text-xs text-stone-500">{formatBytes(file.size)}</span>
                </span>
                <button
                  type="button"
                  onClick={() => remove(id)}
                  aria-label={`Retirer ${file.name}`}
                  className="btn btn-ghost size-8 shrink-0 p-0 hover:bg-red-50 hover:text-red-700"
                >
                  <Icon name="x" className="size-4" />
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex items-center gap-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-stone-100">
              <div
                className="h-full rounded-full bg-brand-600 transition-all"
                style={{ width: `${Math.min(100, (totalSize / ATTACHMENT_MAX_TOTAL_BYTES) * 100)}%` }}
              />
            </div>
            <span className="shrink-0 text-xs text-stone-500 tabular-nums">
              {files.length}/{ATTACHMENT_MAX_FILES} · {formatBytes(totalSize)} / {formatBytes(ATTACHMENT_MAX_TOTAL_BYTES)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
