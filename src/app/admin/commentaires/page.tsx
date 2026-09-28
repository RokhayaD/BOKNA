import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { moderateComment } from "@/actions/ideas";
import { AdminPageHeader } from "@/components/AdminPageHeader";
import { ModerationButtons } from "@/components/admin/ModerationButtons";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate, moderationStatus } from "@/lib/labels";

export default async function AdminCommentsPage() {
  const comments = await prisma.comment.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } }, idea: { select: { id: true, title: true } } },
  });

  return (
    <div>
      <AdminPageHeader
        title="Modération des commentaires"
        description={`${comments.length} commentaire${comments.length > 1 ? "s" : ""} au total.`}
      />
      {comments.length === 0 ? (
        <EmptyState icon="message" title="Aucun commentaire" />
      ) : (
        <ul className="space-y-3">
          {comments.map((comment) => (
            <li key={comment.id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar name={comment.author.name} />
                  <p className="min-w-0 text-sm text-stone-500">
                    <span className="font-semibold text-ink">{comment.author.name}</span> sur{" "}
                    <Link href={`/idees/${comment.idea.id}`} className="font-medium text-stone-700 hover:text-brand-700">
                      {comment.idea.title}
                    </Link>
                    <span className="block text-xs">{formatDate(comment.createdAt)}</span>
                  </p>
                </div>
                <Badge tone={moderationStatus[comment.status].tone} dot>
                  {moderationStatus[comment.status].m}
                </Badge>
              </div>
              <p className="mt-3 text-sm leading-relaxed whitespace-pre-wrap text-stone-700">{comment.content}</p>

              <form action={moderateComment} className="mt-4 border-t border-stone-100 pt-4">
                <input type="hidden" name="commentId" value={comment.id} />
                <input type="hidden" name="ideaId" value={comment.idea.id} />
                <ModerationButtons />
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
