import { prisma } from "@/lib/prisma";
import { moderateIdea } from "@/actions/ideas";

const statusLabels: Record<string, string> = {
  PENDING: "En attente",
  APPROVED: "Approuvée",
  REJECTED: "Rejetée",
};

export default async function AdminIdeasPage() {
  const ideas = await prisma.idea.findMany({
    orderBy: { createdAt: "desc" },
    include: { commune: true, author: { select: { name: true } } },
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Modération des idées</h1>
      <ul className="space-y-4">
        {ideas.map((idea) => (
          <li key={idea.id} className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-semibold text-slate-900">{idea.title}</h2>
              <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                {statusLabels[idea.status]}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              {idea.commune.name} · par {idea.author.name}
            </p>
            <p className="mt-2 text-sm text-slate-700">{idea.description}</p>

            <form action={moderateIdea} className="mt-3 space-y-2">
              <input type="hidden" name="ideaId" value={idea.id} />
              <textarea
                name="adminReply"
                defaultValue={idea.adminReply ?? ""}
                rows={2}
                placeholder="Réponse de l'administration (optionnel)"
                className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
              />
              <div className="flex gap-2">
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
              </div>
            </form>
          </li>
        ))}
        {ideas.length === 0 && <p className="text-sm text-slate-500">Aucune idée soumise.</p>}
      </ul>
    </div>
  );
}
