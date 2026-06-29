import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/PageHero";

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
      <PageHero
        eyebrow={department.region.name}
        title={department.name}
        subtitle="Sélectionnez une commune pour consulter sa présentation, ses projets et participer à sa vie municipale."
        backgroundImage={`/regions/${department.region.slug.toUpperCase()}.jpeg`}
        breadcrumb={
          <>
            <Link href="/">Régions</Link>
            <span>/</span>
            <Link href={`/regions/${department.region.slug}`}>{department.region.name}</Link>
            <span>/</span>
            <span className="text-white">{department.name}</span>
          </>
        }
      />

      <section className="mx-auto max-w-5xl px-4 py-12">
        {department.communes.length === 0 ? (
          <p className="text-sm text-slate-500">Aucune commune référencée pour le moment.</p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {department.communes.map((commune) => (
              <Link
                key={commune.id}
                href={`/communes/${commune.slug}`}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-900/5 transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl"
              >
                <div
                  aria-hidden
                  className="absolute -top-10 -right-10 h-28 w-28 rounded-full bg-emerald-50 transition group-hover:scale-150 group-hover:bg-emerald-100"
                />
                <div className="relative">
                  <h2 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700">
                    {commune.name}
                  </h2>
                  {commune.population && (
                    <p className="mt-1 text-sm text-slate-500">
                      {commune.population.toLocaleString("fr-FR")} habitants
                    </p>
                  )}
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 opacity-0 transition group-hover:opacity-100">
                    Découvrir
                    <span aria-hidden className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
