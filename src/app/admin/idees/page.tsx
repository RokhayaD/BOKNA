import { prisma } from "@/lib/prisma";
import { moderateIdea } from "@/actions/ideas";
import { AdminPageHeader } from "@/components/AdminPageHeader";
import { Badge } from "@/components/Badge";

const statusBadge: Record<string, { label: string; color: "amber" | "emerald" | "red" }> = {
  PENDING: { label: "En attente", color: "amber" },
  APPROVED: { label: "Approuvée", color: "emerald" },
  REJECTED: { label: "Rejetée", color: "red" },
};

export default async function AdminIdeasPage() {
  const ideas = await prisma.idea.findMany({
    orderBy: { createdAt: "desc" },
    include: { commune: true, author: { select: { name: true } } },
  });

  const pendingCount = ideas.filter((i) => i.status === "PENDING").length;

  return (
    <div>
      <AdminPageHeader
        title="Modération des idées"
        description={`${pendingCount} idée(s) en attente de modération sur ${ideas.length} au total.`}
      />
      <ul className="space-y-4">
        {ideas.map((idea) => (
          <li key={idea.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-bold text-slate-900">{idea.title}</h2>
              <Badge color={statusBadge[idea.status].color}>{statusBadge[idea.status].label}</Badge>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              {idea.commune.name} · par {idea.author.name}
            </p>
            <p className="mt-2 text-sm text-slate-700">{idea.description}</p>

            <form action={moderateIdea} className="mt-4 space-y-2 border-t border-slate-100 pt-4">
              <input type="hidden" name="ideaId" value={idea.id} />
              <textarea
                name="adminReply"
                defaultValue={idea.adminReply ?? ""}
                rows={2}
                placeholder="Réponse de l'administration (optionnel)"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
              <div className="flex gap-2">
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
              </div>
            </form>
          </li>
        ))}
        {ideas.length === 0 && (
          <li className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
            Aucune idée soumise.
          </li>
        )}
      </ul>
    </div>
  );
}
