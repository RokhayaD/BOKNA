import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/EmptyState";
import { AutoSubmitSelect } from "@/components/AutoSubmitSelect";
import { ideaCategories, plural } from "@/lib/labels";

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

  const hasFilters = Boolean(communeId || category);

  return (
    <div>
      <PageHeader
        eyebrow="Boîte à idées"
        title="Les idées des citoyens"
        subtitle="Améliorations, signalements, investissements ou projets communautaires : découvrez, soutenez et commentez les propositions pour votre commune."
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Boîte à idées" }]}
        actions={
          <Link href="/idees/nouvelle" className="btn btn-accent btn-lg">
            <Icon name="plus" className="size-4" />
            Proposer une idée
          </Link>
        }
      />

      <div className="container-page py-10 sm:py-12">
        <form className="card flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
          <label className="sr-only" htmlFor="filter-commune">
            Commune
          </label>
          <AutoSubmitSelect id="filter-commune" name="communeId" defaultValue={communeId ?? ""} className="input sm:max-w-64">
            <option value="">Toutes les communes</option>
            {communes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </AutoSubmitSelect>
          <label className="sr-only" htmlFor="filter-category">
            Catégorie
          </label>
          <AutoSubmitSelect id="filter-category" name="category" defaultValue={category ?? ""} className="input sm:max-w-64">
            <option value="">Toutes les catégories</option>
            {Object.entries(ideaCategories).map(([value, c]) => (
              <option key={value} value={value}>
                {c.label}
              </option>
            ))}
          </AutoSubmitSelect>
          <noscript>
            <button type="submit" className="btn btn-secondary">
              Filtrer
            </button>
          </noscript>
          <div className="flex items-center justify-between gap-3 px-1 sm:ml-auto">
            <span className="text-sm text-stone-500">{plural(ideas.length, "idée")}</span>
            {hasFilters && (
              <Link href="/idees" className="btn btn-ghost btn-sm">
                <Icon name="rotate-ccw" className="size-3.5" />
                Réinitialiser
              </Link>
            )}
          </div>
        </form>

        {ideas.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              icon="lightbulb"
              title={hasFilters ? "Aucune idée ne correspond à ces filtres" : "Aucune idée publiée pour le moment"}
              action={
                hasFilters ? (
                  <Link href="/idees" className="btn btn-secondary btn-sm">
                    Voir toutes les idées
                  </Link>
                ) : (
                  <Link href="/idees/nouvelle" className="btn btn-primary btn-sm">
                    Proposer une idée
                  </Link>
                )
              }
            >
              {hasFilters ? "Essayez une autre commune ou une autre catégorie." : "Soyez le premier à partager une idée."}
            </EmptyState>
          </div>
        ) : (
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {ideas.map((idea) => {
              const cat = ideaCategories[idea.category];
              return (
                <li key={idea.id}>
                  <Link href={`/idees/${idea.id}`} className="card card-interactive group flex h-full flex-col p-6">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone="brand">
                        <Icon name={cat.icon} className="size-3.5" />
                        {cat.label}
                      </Badge>
                      <span className="flex items-center gap-1 text-xs text-stone-500">
                        <Icon name="map-pin" className="size-3.5" />
                        {idea.commune.name}
                      </span>
                    </div>
                    <h2 className="mt-4 text-lg leading-snug font-semibold group-hover:text-brand-700">{idea.title}</h2>
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-stone-600">{idea.description}</p>
                    <div className="mt-auto pt-5">
                      <div className="flex items-center justify-between gap-3 border-t border-stone-100 pt-4">
                        <span className="flex min-w-0 items-center gap-2 text-sm text-stone-600">
                          <Avatar name={idea.author.name} size="sm" />
                          <span className="truncate">{idea.author.name}</span>
                        </span>
                        <span className="flex shrink-0 items-center gap-4 text-sm font-medium text-stone-500">
                          <span className="flex items-center gap-1.5" title="Soutiens">
                            <Icon name="thumbs-up" className="size-4" />
                            {idea._count.votes}
                          </span>
                          <span className="flex items-center gap-1.5" title="Commentaires">
                            <Icon name="message" className="size-4" />
                            {idea._count.comments}
                          </span>
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
