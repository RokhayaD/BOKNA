import { prisma } from "@/lib/prisma";
import { moderateComment } from "@/actions/ideas";

const statusLabels: Record<string, string> = {
  PENDING: "En attente",
  APPROVED: "Approuvé",
  REJECTED: "Rejeté",
};

export default async function AdminCommentsPage() {
  const comments = await prisma.comment.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } }, idea: { select: { id: true, title: true } } },
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Modération des commentaires</h1>
      <ul className="space-y-3">
        {comments.map((comment) => (
          <li key={comment.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-slate-500">
                sur <span className="font-medium text-slate-700">{comment.idea.title}</span> · par{" "}
                {comment.author.name}
              </p>
              <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                {statusLabels[comment.status]}
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-700">{comment.content}</p>

            <form action={moderateComment} className="mt-3 flex gap-2">
              <input type="hidden" name="commentId" value={comment.id} />
              <input type="hidden" name="ideaId" value={comment.idea.id} />
              <button
                type="submit"
                name="status"
                value="APPROVED"
                className="rounded bg-emerald-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-600"
              >
                Approuver
              </button>
              <button
                type="submit"
                name="status"
                value="REJECTED"
                className="rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-500"
              >
                Rejeter
              </button>
            </form>
          </li>
        ))}
        {comments.length === 0 && <p className="text-sm text-slate-500">Aucun commentaire.</p>}
      </ul>
    </div>
  );
}
