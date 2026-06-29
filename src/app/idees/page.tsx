import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { PageHero } from "@/components/PageHero";
import { Badge } from "@/components/Badge";

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
    <div>
      <PageHero
        eyebrow="Boîte à idées"
        title="Vos idées pour le Sénégal"
        subtitle="Améliorations, signalements, investissements ou projets communautaires : proposez, soutenez et commentez les idées de votre commune."
        breadcrumb={<span className="text-white">Boîte à idées</span>}
        actions={
          <Link
            href="/idees/nouvelle"
            className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-emerald-800 shadow-lg shadow-emerald-950/30 transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            + Proposer une idée
          </Link>
        }
      />

      <div className="mx-auto max-w-5xl px-4 py-12">
        <form className="mb-8 flex flex-wrap gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <select
            name="communeId"
            defaultValue={communeId ?? ""}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm"
          >
            <option value="">Toutes les communes</option>
            {communes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            name="category"
            defaultValue={category ?? ""}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm"
          >
            <option value="">Toutes les catégories</option>
            {Object.entries(categoryLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-full bg-slate-800 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Filtrer
          </button>
        </form>

        <ul className="space-y-4">
          {ideas.map((idea) => (
            <li
              key={idea.id}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-lg"
            >
              <Link
                href={`/idees/${idea.id}`}
                className="text-lg font-bold text-slate-900 group-hover:text-emerald-700"
              >
                {idea.title}
              </Link>
              <p className="mt-1 line-clamp-2 text-sm text-slate-600">{idea.description}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <Badge>{categoryLabels[idea.category]}</Badge>
                <span>{idea.commune.name}</span>
                <span>·</span>
                <span>par {idea.author.name}</span>
                <span className="ml-auto flex items-center gap-3 font-medium">
                  <span>👍 {idea._count.votes}</span>
                  <span>💬 {idea._count.comments}</span>
                </span>
              </div>
            </li>
          ))}
          {ideas.length === 0 && (
            <li className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
              Aucune idée ne correspond à ces filtres.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
