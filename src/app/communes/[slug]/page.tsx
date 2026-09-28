import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { publicIdeaWhere } from "@/lib/ideas";
import { CommuneMapLoader as CommuneMap } from "@/components/CommuneMapLoader";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { EmptyState } from "@/components/ui/EmptyState";
import { ideaCategories, projectStatus } from "@/lib/labels";

export default async function CommunePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const commune = await prisma.commune.findUnique({
    where: { slug },
    include: {
      department: { include: { region: true } },
      projects: { orderBy: { createdAt: "desc" } },
      ideas: {
        where: publicIdeaWhere,
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { _count: { select: { votes: true, comments: true } } },
      },
      _count: { select: { users: true } },
    },
  });

  if (!commune) notFound();

  const { department } = commune;
  const facts = [
    { icon: "map" as const, label: "Région", value: department.region.name, href: `/regions/${department.region.slug}` },
    { icon: "layers" as const, label: "Département", value: department.name, href: `/regions/${department.region.slug}/${department.slug}` },
    { icon: "users" as const, label: "Population", value: commune.population ? commune.population.toLocaleString("fr-FR") : "Non renseignée" },
    { icon: "user" as const, label: "Citoyens inscrits", value: commune._count.users.toLocaleString("fr-FR") },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Commune"
        title={commune.name}
        subtitle={`Commune du département de ${department.name}, région de ${department.region.name}.`}
        image={`/regions/${department.region.slug.toUpperCase()}.jpeg`}
        breadcrumb={[
          { label: "Régions", href: "/" },
          { label: department.region.name, href: `/regions/${department.region.slug}` },
          { label: department.name, href: `/regions/${department.region.slug}/${department.slug}` },
          { label: commune.name },
        ]}
        actions={
          <>
            <Link href={`/idees/nouvelle?communeId=${commune.id}`} className="btn btn-accent btn-lg">
              <Icon name="lightbulb" className="size-4" />
              Proposer une idée
            </Link>
            <Link
              href={`/participation/nouvelle?communeId=${commune.id}&type=MAYOR_CANDIDACY`}
              className="btn btn-secondary btn-lg"
            >
              <Icon name="landmark" className="size-4 text-brand-700" />
              Devenir membre de l&apos;équipe municipale
            </Link>
          </>
        }
      />

      <div className="container-page grid grid-cols-1 gap-8 py-12 sm:py-16 lg:grid-cols-3">
        {/* Carte puis présentation, en tête de page */}
        <section className="card overflow-hidden lg:col-span-2">
          <div className="isolate p-2">
            <CommuneMap
              lat={commune.centroidLat}
              lng={commune.centroidLng}
              name={commune.name}
              className="h-64 sm:h-80"
            />
          </div>
          <div className="px-6 pt-4 pb-6 sm:px-8 sm:pb-8">
            <h2 className="mt-2 text-xl font-semibold">Présentation</h2>
            <p className="mt-3 leading-relaxed text-stone-600">
              {commune.description ?? "Aucune présentation n'est encore disponible pour cette commune."}
            </p>
          </div>
        </section>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:col-start-3 lg:row-span-2 lg:row-start-1 lg:self-start">
          <section className="card p-6">
            <h2 className="text-base font-semibold">En bref</h2>
            <dl className="mt-4 divide-y divide-stone-100">
              {facts.map((fact) => (
                <div key={fact.label} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                  <dt className="flex items-center gap-2 text-sm text-stone-500">
                    <Icon name={fact.icon} className="size-4 text-stone-400" />
                    {fact.label}
                  </dt>
                  <dd className="text-right text-sm font-semibold text-ink">
                    {fact.href ? (
                      <Link href={fact.href} className="hover:text-brand-700">
                        {fact.value}
                      </Link>
                    ) : (
                      fact.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

        </aside>

        <div className="space-y-8 lg:col-span-2">
          <section className="card p-6 sm:p-8">
            <h2 className="text-xl font-semibold">Projets de la commune</h2>
            {commune.projects.length === 0 ? (
              <p className="mt-3 text-sm text-stone-500">Aucun projet référencé pour le moment.</p>
            ) : (
              <ol className="mt-6 space-y-6">
                {commune.projects.map((project, i) => (
                  <li key={project.id} className="relative pl-8">
                    {i < commune.projects.length - 1 && (
                      <span aria-hidden className="absolute top-6 bottom-[-1.5rem] left-[9px] w-px bg-stone-200" />
                    )}
                    <span
                      aria-hidden
                      className="absolute top-1 left-0 flex size-[19px] items-center justify-center rounded-full border-2 border-brand-600 bg-white"
                    >
                      <span className="size-1.5 rounded-full bg-brand-600" />
                    </span>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-sans text-base font-semibold text-ink">{project.title}</h3>
                      <Badge tone={projectStatus[project.status].tone} dot>
                        {projectStatus[project.status].label}
                      </Badge>
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-stone-600">{project.description}</p>
                  </li>
                ))}
              </ol>
            )}
          </section>

          <section>
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold">Idées récentes</h2>
              {commune.ideas.length > 0 && (
                <Link href={`/idees?communeId=${commune.id}`} className="btn btn-ghost btn-sm">
                  Voir toutes les idées
                  <Icon name="arrow-right" className="size-4" />
                </Link>
              )}
            </div>
            {commune.ideas.length === 0 ? (
              <EmptyState
                icon="lightbulb"
                title="Aucune idée publiée"
                action={
                  <Link href={`/idees/nouvelle?communeId=${commune.id}`} className="btn btn-primary btn-sm">
                    Proposer la première idée
                  </Link>
                }
              >
                Soyez le premier à proposer une idée pour {commune.name}.
              </EmptyState>
            ) : (
              <ul className="card divide-y divide-stone-100 overflow-hidden">
                {commune.ideas.map((idea) => (
                  <li key={idea.id}>
                    <Link
                      href={`/idees/${idea.id}`}
                      className="group flex items-center gap-4 px-5 py-4 transition hover:bg-stone-50 sm:px-6"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium text-ink group-hover:text-brand-700">
                          {idea.title}
                        </span>
                        <span className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-stone-500">
                          <Badge tone="neutral">{ideaCategories[idea.category].label}</Badge>
                          <span className="flex items-center gap-1">
                            <Icon name="thumbs-up" className="size-3.5" />
                            {idea._count.votes}
                          </span>
                          <span className="flex items-center gap-1">
                            <Icon name="message" className="size-3.5" />
                            {idea._count.comments}
                          </span>
                        </span>
                      </span>
                      <Icon name="chevron-right" className="size-4 shrink-0 text-stone-400 group-hover:text-brand-700" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-2xl border border-brand-700/15 bg-brand-50 p-6 sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-md">
                <h2 className="text-xl font-semibold text-brand-950">Participer à la vie de {commune.name}</h2>
                <p className="mt-2 text-sm leading-relaxed text-brand-900/80">
                  Une idée, un signalement, l&apos;envie de vous impliquer ? Votre voix compte.
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-2 sm:w-60">
                <Link href={`/idees/nouvelle?communeId=${commune.id}`} className="btn btn-primary w-full">
                  <Icon name="lightbulb" className="size-4" />
                  Proposer une idée
                </Link>
                <Link
                  href={`/participation/nouvelle?communeId=${commune.id}&type=INITIATIVE`}
                  className="btn btn-secondary w-full"
                >
                  <Icon name="sprout" className="size-4 text-brand-700" />
                  Participer à une initiative
                </Link>
              </div>
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}
