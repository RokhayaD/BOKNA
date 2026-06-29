import { prisma } from "@/lib/prisma";
import { moderateComment } from "@/actions/ideas";
import { AdminPageHeader } from "@/components/AdminPageHeader";
import { Badge } from "@/components/Badge";

const statusBadge: Record<string, { label: string; color: "amber" | "emerald" | "red" }> = {
  PENDING: { label: "En attente", color: "amber" },
  APPROVED: { label: "Approuvé", color: "emerald" },
  REJECTED: { label: "Rejeté", color: "red" },
};

export default async function AdminCommentsPage() {
  const comments = await prisma.comment.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } }, idea: { select: { id: true, title: true } } },
  });

  return (
    <div>
      <AdminPageHeader
        title="Modération des commentaires"
        description={`${comments.length} commentaire(s) au total.`}
      />
      <ul className="space-y-3">
        {comments.map((comment) => (
          <li key={comment.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-slate-500">
                sur <span className="font-medium text-slate-700">{comment.idea.title}</span> · par{" "}
                {comment.author.name}
              </p>
              <Badge color={statusBadge[comment.status].color}>{statusBadge[comment.status].label}</Badge>
            </div>
            <p className="mt-2 text-sm text-slate-700">{comment.content}</p>

            <form action={moderateComment} className="mt-3 flex gap-2 border-t border-slate-100 pt-3">
              <input type="hidden" name="commentId" value={comment.id} />
              <input type="hidden" name="ideaId" value={comment.idea.id} />
              <button
                type="submit"
                name="status"
                value="APPROVED"
                className="rounded-full bg-emerald-700 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-emerald-600"
              >
                Approuver
              </button>
              <button
                type="submit"
                name="status"
                value="REJECTED"
                className="rounded-full bg-red-600 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-red-500"
              >
                Rejeter
              </button>
            </form>
          </li>
        ))}
        {comments.length === 0 && (
          <li className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
            Aucun commentaire.
          </li>
        )}
      </ul>
    </div>
  );
}
