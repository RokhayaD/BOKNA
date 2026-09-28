import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/PageHeader";
import { Icon } from "@/components/ui/Icon";
import { EmptyState } from "@/components/ui/EmptyState";
import { plural } from "@/lib/labels";

export default async function DepartmentPage({
  params,
}: {
  params: Promise<{ slug: string; deptSlug: string }>;
}) {
  const { slug, deptSlug } = await params;

  const department = await prisma.department.findUnique({
    where: { slug: deptSlug },
    include: {
      region: true,
      communes: { orderBy: { name: "asc" } },
    },
  });

  if (!department || department.region.slug !== slug) notFound();

  return (
    <div>
      <PageHeader
        eyebrow={`Région de ${department.region.name}`}
        title={`Département de ${department.name}`}
        subtitle="Sélectionnez une commune pour consulter sa présentation, ses projets et participer à sa vie municipale."
        image={`/regions/${department.region.slug.toUpperCase()}.jpeg`}
        breadcrumb={[
          { label: "Régions", href: "/" },
          { label: department.region.name, href: `/regions/${department.region.slug}` },
          { label: department.name },
        ]}
        meta={[{ icon: "building", label: plural(department.communes.length, "commune") }]}
      />

      <section className="container-page py-12 sm:py-16">
        <h2 className="text-xl font-semibold">Communes</h2>
        <div className="mt-6">
          {department.communes.length === 0 ? (
            <EmptyState icon="building" title="Aucune commune référencée">
              Les communes de ce département seront bientôt disponibles.
            </EmptyState>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {department.communes.map((commune) => (
                <Link
                  key={commune.id}
                  href={`/communes/${commune.slug}`}
                  className="card card-interactive group flex items-center gap-4 p-5"
                >
                  <span className="icon-tile">
                    <Icon name="building" className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-display text-base font-semibold text-ink">
                      {commune.name}
                    </span>
                    <span className="block text-sm text-stone-500">
                      {commune.population
                        ? `${commune.population.toLocaleString("fr-FR")} habitants`
                        : "Population non renseignée"}
                    </span>
                  </span>
                  <Icon
                    name="arrow-right"
                    className="size-4 text-stone-400 transition group-hover:translate-x-0.5 group-hover:text-brand-700"
                  />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
