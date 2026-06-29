import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const [regions, communeCount, citizenCount, ideaCount] = await Promise.all([
    prisma.region.findMany({
      orderBy: { name: "asc" },
      include: {
        departments: { select: { _count: { select: { communes: true } } } },
      },
    }),
    prisma.commune.count(),
    prisma.user.count(),
    prisma.idea.count({ where: { status: "APPROVED" } }),
  ]);

  const stats = [
    { value: regions.length, label: "Régions" },
    { value: communeCount, label: "Communes" },
    { value: citizenCount, label: "Citoyens inscrits" },
    { value: ideaCount, label: "Idées approuvées" },
  ];

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-800 to-emerald-700 px-4 py-20 text-white sm:py-28">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-lime-300/10 blur-3xl"
        />

        <div className="relative mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-emerald-200 uppercase ring-1 ring-white/20 ring-inset">
            Plateforme citoyenne du Sénégal
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Bienvenue sur <span className="text-emerald-300">Bokna</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-emerald-50/90">
            Découvrez votre région, proposez vos idées pour votre commune et participez à la vie
            municipale. Sélectionnez une région pour commencer.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="#regions"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-emerald-800 shadow-lg shadow-emerald-950/30 transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              Explorer les régions
            </a>
            <Link
              href="/idees"
              className="rounded-full border border-white/30 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
            >
              Voir la boîte à idées
            </Link>
          </div>

          <dl className="mx-auto mt-14 grid max-w-2xl grid-cols-2 gap-y-6 divide-y divide-white/10 sm:grid-cols-4 sm:divide-x sm:divide-y-0">
            {stats.map((stat) => (
              <div key={stat.label} className="pt-6 text-center first:pt-0 sm:px-4 sm:pt-0">
                <dd className="text-2xl font-bold text-white sm:text-3xl">
                  {stat.value.toLocaleString("fr-FR")}
                </dd>
                <dt className="mt-1 text-xs font-medium tracking-wide text-emerald-200/80 uppercase">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section id="regions" className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Explorez les régions du Sénégal
          </h2>
          <p className="mt-3 text-slate-500">
            Chaque région regroupe plusieurs départements et communes. Choisissez la vôtre pour
            découvrir ses projets, ses idées citoyennes et son actualité.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {regions.map((region) => {
            const communeTotal = region.departments.reduce(
              (sum, dept) => sum + dept._count.communes,
              0
            );

            return (
              <Link
                key={region.id}
                href={`/regions/${region.slug}`}
                className="group relative flex h-64 flex-col justify-end overflow-hidden rounded-2xl shadow-md ring-1 ring-slate-900/5 transition duration-300 ease-out hover:-translate-y-1.5 hover:shadow-2xl"
              >
                <Image
                  src={`/regions/${region.slug.toUpperCase()}.jpeg`}
                  alt={region.name}
                  fill
                  sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition duration-500 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-emerald-300/0 ring-inset transition group-hover:ring-emerald-300/60" />

                <div className="relative z-10 p-5">
                  <span className="inline-flex items-center rounded-full bg-emerald-500/90 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-white uppercase shadow-sm">
                    {region.departments.length} département{region.departments.length > 1 ? "s" : ""} ·{" "}
                    {communeTotal} commune{communeTotal > 1 ? "s" : ""}
                  </span>
                  <h3 className="mt-2 text-xl font-bold text-white drop-shadow-sm">{region.name}</h3>
                  <p className="text-sm font-medium text-emerald-200/90">{region.name} la bokk</p>
                  <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-white opacity-0 transition group-hover:opacity-100">
                    Découvrir
                    <span aria-hidden className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
