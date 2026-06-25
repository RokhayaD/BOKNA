import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const regions = await prisma.region.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { departments: true } } },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <section className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
          Bienvenue sur Bokna
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-slate-600">
          Découvrez votre région, proposez vos idées pour votre commune et participez
          à la vie municipale. Sélectionnez une région pour commencer.
        </p>
      </section>

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {regions.map((region) => (
          <Link
            key={region.id}
            href={`/regions/${region.slug}`}
            className="group flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-md"
          >
            <span className="text-lg font-semibold text-slate-900 group-hover:text-emerald-700">
              {region.name}
            </span>
            <span className="mt-1 text-sm font-medium text-emerald-700">
              {region.name} la bokk
            </span>
            <span className="mt-2 text-xs text-slate-500">
              {region._count.departments} départements
            </span>
          </Link>
        ))}
      </section>
    </div>
  );
}
