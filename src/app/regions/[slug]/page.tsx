import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { publicIdeaWhere } from "@/lib/ideas";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Icon, type IconName } from "@/components/ui/Icon";
import { EmptyState } from "@/components/ui/EmptyState";
import { ideaCategories, plural } from "@/lib/labels";

export default async function RegionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const region = await prisma.region.findUnique({
    where: { slug },
    include: {
      departments: {
        orderBy: { name: "asc" },
        include: { _count: { select: { communes: true } } },
      },
    },
  });

  if (!region) notFound();

  const inRegion = { commune: { department: { regionId: region.id } } };
  const [citizenCount, ideaCount, recentIdeas] = await Promise.all([
    prisma.user.count({ where: inRegion }),
    prisma.idea.count({ where: { ...publicIdeaWhere, ...inRegion } }),
    prisma.idea.findMany({
      where: { ...publicIdeaWhere, ...inRegion },
      orderBy: { createdAt: "desc" },
      take: 4,
      include: { commune: true, _count: { select: { votes: true, comments: true } } },
    }),
  ]);

  const communeTotal = region.departments.reduce((sum, d) => sum + d._count.communes, 0);

  const facts: { icon: IconName; label: string; value: string }[] = [
    { icon: "landmark", label: "Chef-lieu", value: region.capital ?? "Non renseigné" },
    { icon: "ruler", label: "Superficie", value: region.area ? `${region.area.toLocaleString("fr-FR")} km²` : "Non renseignée" },
    { icon: "users", label: "Population", value: region.population ? `${region.population.toLocaleString("fr-FR")} hab.` : "Non renseignée" },
    { icon: "layers", label: "Départements", value: region.departments.length.toLocaleString("fr-FR") },
    { icon: "building", label: "Communes", value: communeTotal.toLocaleString("fr-FR") },
    { icon: "user", label: "Citoyens inscrits", value: citizenCount.toLocaleString("fr-FR") },
    { icon: "lightbulb", label: "Idées publiées", value: ideaCount.toLocaleString("fr-FR") },
  ];

  return (
    <div>
      <PageHeader
        eyebrow={`${region.name} la bokk`}
        title={`Région de ${region.name}`}
        subtitle="Découvrez la région, ses départements et ses communes, ainsi que les idées portées par ses habitants."
        image={`/regions/${region.slug.toUpperCase()}.jpeg`}
        breadcrumb={[{ label: "Régions", href: "/" }, { label: region.name }]}
        meta={[
          { icon: "layers", label: plural(region.departments.length, "département") },
          { icon: "building", label: plural(communeTotal, "commune") },
        ]}
      />

      <div className="container-page grid grid-cols-1 gap-8 py-12 sm:py-16 lg:grid-cols-3">
        <section className="card p-6 sm:p-8 lg:col-span-2">
          <h2 className="text-xl font-semibold">Présentation</h2>
          <p className="mt-3 leading-relaxed text-stone-600">
            {region.description ?? "Aucune présentation n'est encore disponible pour cette région."}
          </p>
          {region.highlights.length > 0 && (
            <div className="mt-6 border-t border-stone-100 pt-6">
              <h3 className="font-sans text-sm font-semibold text-ink">Points clés</h3>
              <ul className="mt-3 grid gap-3">
                {region.highlights.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-stone-700">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-800">
                      <Icon name="check" className="size-3" strokeWidth={2.5} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <aside className="lg:sticky lg:top-24 lg:col-start-3 lg:row-span-2 lg:row-start-1 lg:self-start">
          <section className="card p-6">
            <h2 className="text-base font-semibold">En bref</h2>
            <dl className="mt-4 divide-y divide-stone-100">
              {facts.map((fact) => (
                <div key={fact.label} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                  <dt className="flex items-center gap-2 text-sm text-stone-500">
                    <Icon name={fact.icon} className="size-4 text-stone-400" />
                    {fact.label}
                  </dt>
                  <dd className="text-right text-sm font-semibold text-ink">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        </aside>

        <div className="space-y-10 lg:col-span-2">
          <section>
            <h2 className="text-xl font-semibold">Départements</h2>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {region.departments.map((dept) => (
                <Link
                  key={dept.id}
                  href={`/regions/${region.slug}/${dept.slug}`}
                  className="card card-interactive group flex items-center gap-4 p-5"
                >
                  <span className="icon-tile">
                    <Icon name="layers" className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-display text-base font-semibold text-ink">{dept.name}</span>
                    <span className="block text-sm text-stone-500">{plural(dept._count.communes, "commune")}</span>
                  </span>
                  <Icon
                    name="arrow-right"
                    className="size-4 text-stone-400 transition group-hover:translate-x-0.5 group-hover:text-brand-700"
                  />
                </Link>
              ))}
            </div>
          </section>

          <section>
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold">Idées récentes de la région</h2>
            </div>
            {recentIdeas.length === 0 ? (
              <EmptyState
                icon="lightbulb"
                title="Aucune idée publiée dans la région"
                action={
                  <Link href="/idees/nouvelle" className="btn btn-primary btn-sm">
                    Proposer une idée
                  </Link>
                }
              >
                Proposez la première idée pour une commune de la région de {region.name}.
              </EmptyState>
            ) : (
              <ul className="card divide-y divide-stone-100 overflow-hidden">
                {recentIdeas.map((idea) => (
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
                            <Icon name="map-pin" className="size-3.5" />
                            {idea.commune.name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Icon name="thumbs-up" className="size-3.5" />
                            {idea._count.votes}
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
        </div>
      </div>
    </div>
  );
}
