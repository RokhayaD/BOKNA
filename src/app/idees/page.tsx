import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

const categoryLabels: Record<string, string> = {
  AMELIORATION: "Amélioration",
  SIGNALEMENT: "Signalement",
  INVESTISSEMENT: "Investissement",
  PROJET_COMMUNAUTAIRE: "Projet communautaire",
};

export default async function IdeasPage({
  searchParams,
}: {
  searchParams: Promise<{ communeId?: string; category?: string }>;
}) {
  const { communeId, category } = await searchParams;

  const where: Prisma.IdeaWhereInput = { status: "APPROVED" };
  if (communeId) where.communeId = communeId;
  if (category) where.category = category as Prisma.EnumIdeaCategoryFilter["equals"];

  const [ideas, communes] = await Promise.all([
    prisma.idea.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        commune: true,
        author: { select: { name: true } },
        _count: { select: { votes: true, comments: true } },
      },
    }),
    prisma.commune.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Boîte à idées citoyenne</h1>
          <p className="text-slate-600">Idées, signalements et propositions des citoyens.</p>
        </div>
        <Link
          href="/idees/nouvelle"
          className="rounded bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
        >
          Proposer une idée
        </Link>
      </div>

      <form className="mb-6 flex flex-wrap gap-3 rounded-lg border border-slate-200 bg-white p-4">
        <select name="communeId" defaultValue={communeId ?? ""} className="rounded border border-slate-300 px-3 py-1.5 text-sm">
          <option value="">Toutes les communes</option>
          {communes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select name="category" defaultValue={category ?? ""} className="rounded border border-slate-300 px-3 py-1.5 text-sm">
          <option value="">Toutes les catégories</option>
          {Object.entries(categoryLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <button type="submit" className="rounded bg-slate-800 px-4 py-1.5 text-sm font-medium text-white hover:bg-slate-700">
          Filtrer
        </button>
      </form>

      <ul className="space-y-4">
        {ideas.map((idea) => (
          <li key={idea.id} className="rounded-xl border border-slate-200 bg-white p-5">
            <Link href={`/idees/${idea.id}`} className="font-semibold text-slate-900 hover:text-emerald-700">
              {idea.title}
            </Link>
            <p className="mt-1 line-clamp-2 text-sm text-slate-600">{idea.description}</p>
            <p className="mt-2 text-xs text-slate-500">
              {categoryLabels[idea.category]} · {idea.commune.name} · par {idea.author.name} ·{" "}
              {idea._count.votes} soutien(s) · {idea._count.comments} commentaire(s)
            </p>
          </li>
        ))}
        {ideas.length === 0 && (
          <p className="text-sm text-slate-500">Aucune idée ne correspond à ces filtres.</p>
        )}
      </ul>
    </div>
  );
}
