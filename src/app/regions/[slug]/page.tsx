import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/PageHero";

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

  return (
    <div>
      <PageHero
        eyebrow={`${region.name} la bokk`}
        title={region.name}
        subtitle="Choisissez un département pour découvrir ses communes, leurs projets et leurs idées citoyennes."
        backgroundImage={`/regions/${region.slug.toUpperCase()}.jpeg`}
        breadcrumb={
          <>
            <Link href="/">Régions</Link>
            <span>/</span>
            <span className="text-white">{region.name}</span>
          </>
        }
      />

      <section className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {region.departments.map((dept) => (
            <Link
              key={dept.id}
              href={`/regions/${region.slug}/${dept.slug}`}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-900/5 transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl"
            >
              <div
                aria-hidden
                className="absolute -top-10 -right-10 h-28 w-28 rounded-full bg-emerald-50 transition group-hover:scale-150 group-hover:bg-emerald-100"
              />
              <div className="relative">
                <h2 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700">
                  {dept.name}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {dept._count.communes} commune{dept._count.communes > 1 ? "s" : ""}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 opacity-0 transition group-hover:opacity-100">
                  Explorer
                  <span aria-hidden className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
