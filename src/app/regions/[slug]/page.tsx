import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

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
    <div className="mx-auto max-w-5xl px-4 py-10">
      <nav className="mb-4 text-sm text-slate-500">
        <Link href="/" className="hover:underline">
          Régions
        </Link>{" "}
        / <span className="text-slate-700">{region.name}</span>
      </nav>

      <h1 className="text-2xl font-bold text-slate-900">{region.name} la bokk</h1>
      <p className="mt-1 text-slate-600">Choisissez un département pour voir ses communes.</p>

      <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {region.departments.map((dept) => (
          <Link
            key={dept.id}
            href={`/regions/${region.slug}/${dept.slug}`}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-md"
          >
            <h2 className="font-semibold text-slate-900">{dept.name}</h2>
            <p className="mt-1 text-sm text-slate-500">{dept._count.communes} commune(s)</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
