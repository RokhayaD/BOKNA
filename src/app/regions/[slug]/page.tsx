import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/PageHeader";
import { Icon } from "@/components/ui/Icon";
import { plural } from "@/lib/labels";

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

  const communeTotal = region.departments.reduce((sum, d) => sum + d._count.communes, 0);

  return (
    <div>
      <PageHeader
        eyebrow={`${region.name} la bokk`}
        title={`Région de ${region.name}`}
        subtitle="Choisissez un département pour découvrir ses communes, leurs projets et leurs idées citoyennes."
        image={`/regions/${region.slug.toUpperCase()}.jpeg`}
        breadcrumb={[{ label: "Régions", href: "/" }, { label: region.name }]}
        meta={[
          { icon: "layers", label: plural(region.departments.length, "département") },
          { icon: "building", label: plural(communeTotal, "commune") },
        ]}
      />

      <section className="container-page py-12 sm:py-16">
        <h2 className="text-xl font-semibold">Départements</h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
    </div>
  );
}
