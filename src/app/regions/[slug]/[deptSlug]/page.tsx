import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

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
    <div className="mx-auto max-w-5xl px-4 py-10">
      <nav className="mb-4 text-sm text-slate-500">
        <Link href="/" className="hover:underline">
          Régions
        </Link>{" "}
        /{" "}
        <Link href={`/regions/${department.region.slug}`} className="hover:underline">
          {department.region.name}
        </Link>{" "}
        / <span className="text-slate-700">{department.name}</span>
      </nav>

      <h1 className="text-2xl font-bold text-slate-900">Département de {department.name}</h1>
      <p className="mt-1 text-slate-600">Choisissez une commune.</p>

      <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {department.communes.map((commune) => (
          <Link
            key={commune.id}
            href={`/communes/${commune.slug}`}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-md"
          >
            <h2 className="font-semibold text-slate-900">{commune.name}</h2>
            {commune.population && (
              <p className="mt-1 text-sm text-slate-500">
                {commune.population.toLocaleString("fr-FR")} habitants
              </p>
            )}
          </Link>
        ))}
        {department.communes.length === 0 && (
          <p className="text-sm text-slate-500">Aucune commune référencée pour le moment.</p>
        )}
      </section>
    </div>
  );
}
