import { Icon } from "@/components/ui/Icon";
import { formatBytes, isImageType } from "@/lib/attachments";

type Attachment = { id: string; name: string; mimeType: string; size: number };

export function AttachmentList({ attachments, compact = false }: { attachments: Attachment[]; compact?: boolean }) {
  if (attachments.length === 0) return null;
  const images = attachments.filter((a) => isImageType(a.mimeType));
  const documents = attachments.filter((a) => !isImageType(a.mimeType));

  return (
    <div className="space-y-3">
      {images.length > 0 && (
        <ul className={`grid gap-2 ${compact ? "grid-cols-4 sm:grid-cols-6" : "grid-cols-2 sm:grid-cols-3"}`}>
          {images.map((img) => (
            <li key={img.id}>
              <a
                href={`/api/attachments/${img.id}`}
                target="_blank"
                rel="noopener"
                className="group block aspect-square overflow-hidden rounded-xl bg-stone-100 ring-1 ring-stone-900/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- fichier servi par l'API, taille déjà réduite à l'envoi */}
                <img
                  src={`/api/attachments/${img.id}`}
                  alt={img.name}
                  loading="lazy"
                  className="size-full object-cover transition duration-500 ease-soft group-hover:scale-105"
                />
              </a>
            </li>
          ))}
        </ul>
      )}
      {documents.length > 0 && (
        <ul className="grid gap-2 sm:grid-cols-2">
          {documents.map((doc) => (
            <li key={doc.id}>
              <a
                href={`/api/attachments/${doc.id}`}
                target="_blank"
                rel="noopener"
                className="group flex items-center gap-3 rounded-xl border border-stone-200 bg-white p-3 transition hover:border-stone-300 hover:bg-stone-50"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent-50 text-accent-700">
                  <Icon name="file" className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-ink group-hover:text-brand-700">{doc.name}</span>
                  <span className="block text-xs text-stone-500">PDF · {formatBytes(doc.size)}</span>
                </span>
                <Icon name="arrow-up-right" className="size-4 shrink-0 text-stone-400" />
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
