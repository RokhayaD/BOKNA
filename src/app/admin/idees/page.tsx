import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { moderateIdea } from "@/actions/ideas";
import { AdminPageHeader } from "@/components/AdminPageHeader";
import { ModerationButtons } from "@/components/admin/ModerationButtons";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate, formatFcfa, ideaCategories, moderationStatus } from "@/lib/labels";
import { AttachmentList } from "@/components/AttachmentList";

export default async function AdminIdeasPage() {
  const ideas = await prisma.idea.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      commune: true,
      author: { select: { name: true } },
      attachments: { select: { id: true, name: true, mimeType: true, size: true }, orderBy: { createdAt: "asc" } },
    },
  });

  const pendingCount = ideas.filter((i) => i.status === "PENDING").length;

  return (
    <div>
      <AdminPageHeader
        title="Modération des idées"
        description={`${pendingCount} en attente de modération, sur ${ideas.length} au total.`}
      />
      {ideas.length === 0 ? (
        <EmptyState icon="lightbulb" title="Aucune idée soumise" />
      ) : (
        <ul className="space-y-4">
          {ideas.map((idea) => (
            <li key={idea.id} className="card p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link href={`/idees/${idea.id}`} className="font-display text-lg font-semibold text-ink hover:text-brand-700">
                    {idea.title}
                  </Link>
                  <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone-500">
                    <span className="flex items-center gap-1.5">
                      <Icon name={ideaCategories[idea.category].icon} className="size-3.5" />
                      {ideaCategories[idea.category].label}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Icon name="map-pin" className="size-3.5" />
                      {idea.commune.name}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Icon name="user" className="size-3.5" />
                      {idea.author.name}
                    </span>
                    <span>{formatDate(idea.createdAt)}</span>
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {idea.visibility === "PRIVATE" && (
                    <Badge tone="neutral">
                      <Icon name="lock" className="size-3" />
                      Privée
                    </Badge>
                  )}
                  <Badge tone={moderationStatus[idea.status].tone} dot>
                    {moderationStatus[idea.status].f}
                  </Badge>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed whitespace-pre-wrap text-stone-700">{idea.description}</p>
              {idea.estimatedCost !== null && (
                <p className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-paper px-2.5 py-1 text-sm ring-1 ring-stone-200/70">
                  <Icon name="banknote" className="size-4 text-stone-400" />
                  <span className="text-stone-500">Coût estimatif :</span>
                  <span className="font-semibold text-ink tabular-nums">{formatFcfa(idea.estimatedCost)}</span>
                </p>
              )}
              {idea.attachments.length > 0 && (
                <div className="mt-4">
                  <AttachmentList attachments={idea.attachments} compact />
                </div>
              )}

              <form action={moderateIdea} className="mt-5 space-y-3 border-t border-stone-100 pt-5">
                <input type="hidden" name="ideaId" value={idea.id} />
                <label htmlFor={`reply-${idea.id}`} className="label">
                  Réponse de l&apos;administration <span className="font-normal text-stone-400">(optionnel)</span>
                </label>
                <textarea
                  id={`reply-${idea.id}`}
                  name="adminReply"
                  defaultValue={idea.adminReply ?? ""}
                  rows={2}
                  placeholder="Cette réponse sera visible publiquement sous l'idée."
                  className="input resize-y"
                />
                <ModerationButtons />
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
