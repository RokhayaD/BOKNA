import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CommuneMapLoader as CommuneMap } from "@/components/CommuneMapLoader";
import { PageHero } from "@/components/PageHero";
import { Badge } from "@/components/Badge";

const categoryLabels: Record<string, string> = {
  AMELIORATION: "Amélioration",
  SIGNALEMENT: "Signalement",
  INVESTISSEMENT: "Investissement",
  PROJET_COMMUNAUTAIRE: "Projet communautaire",
};

const projectStatusBadge: Record<string, { label: string; color: "emerald" | "amber" | "slate" }> = {
  PLANNED: { label: "Planifié", color: "slate" },
  ONGOING: { label: "En cours", color: "amber" },
  DONE: { label: "Terminé", color: "emerald" },
};

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
        where: { status: "APPROVED" },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { _count: { select: { votes: true, comments: true } } },
      },
      _count: { select: { users: true } },
    },
  });

  if (!commune) notFound();

  const stats = [
    { label: "Région", value: commune.department.region.name },
    { label: "Département", value: commune.department.name },
    { label: "Population", value: commune.population ? commune.population.toLocaleString("fr-FR") : "N/D" },
    { label: "Citoyens inscrits", value: commune._count.users.toLocaleString("fr-FR") },
  ];

  return (
    <div>
      <PageHero
        eyebrow={commune.department.name}
        title={commune.name}
        subtitle={`Commune du département de ${commune.department.name}, région de ${commune.department.region.name}.`}
        backgroundImage={`/regions/${commune.department.region.slug.toUpperCase()}.jpeg`}
        breadcrumb={
          <>
            <Link href="/">Régions</Link>
            <span>/</span>
            <Link href={`/regions/${commune.department.region.slug}`}>
              {commune.department.region.name}
            </Link>
            <span>/</span>
            <Link href={`/regions/${commune.department.region.slug}/${commune.department.slug}`}>
              {commune.department.name}
            </Link>
            <span>/</span>
            <span className="text-white">{commune.name}</span>
          </>
        }
        actions={
          <>
            <Link
              href={`/idees/nouvelle?communeId=${commune.id}`}
              className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-emerald-800 shadow-lg shadow-emerald-950/30 transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              Proposer une idée
            </Link>
            <Link
              href={`/participation/nouvelle?communeId=${commune.id}&type=MAYOR_CANDIDACY`}
              className="rounded-full border border-white/30 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
            >
              Je veux devenir membre de l&apos;équipe municipale
            </Link>
          </>
        }
      />

      <div className="mx-auto max-w-5xl px-4 pt-6">
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl bg-white p-4 text-center shadow-md ring-1 ring-slate-900/5"
            >
              <dd className="text-xl font-bold text-emerald-700 sm:text-2xl">{s.value}</dd>
              <dt className="mt-1 text-xs font-medium tracking-wide text-slate-500 uppercase">
                {s.label}
              </dt>
            </div>
          ))}
        </dl>
      </div>

      <section className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-2 text-lg font-bold text-slate-900">Présentation</h2>
              <p className="text-sm leading-relaxed text-slate-600">
                {commune.description ?? "Aucune présentation disponible pour le moment."}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-bold text-slate-900">Projets en cours</h2>
              {commune.projects.length === 0 ? (
                <p className="text-sm text-slate-500">Aucun projet référencé pour le moment.</p>
              ) : (
                <ul className="space-y-4">
                  {commune.projects.map((project) => (
                    <li key={project.id} className="relative border-l-2 border-emerald-200 pl-4">
                      <span className="absolute top-1 -left-[5px] h-2.5 w-2.5 rounded-full bg-emerald-600" />
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-semibold text-slate-900">{project.title}</span>
                        <Badge color={projectStatusBadge[project.status].color}>
                          {projectStatusBadge[project.status].label}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-slate-600">{project.description}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">Idées récentes</h2>
                <Link
                  href={`/idees?communeId=${commune.id}`}
                  className="text-sm font-semibold text-emerald-700 hover:underline"
                >
                  Voir tout →
                </Link>
              </div>
              {commune.ideas.length === 0 ? (
                <p className="text-sm text-slate-500">Aucune idée publiée pour cette commune.</p>
              ) : (
                <ul className="space-y-3">
                  {commune.ideas.map((idea) => (
                    <li
                      key={idea.id}
                      className="rounded-xl border border-slate-100 p-3 transition hover:border-emerald-200 hover:bg-emerald-50/40"
                    >
                      <Link
                        href={`/idees/${idea.id}`}
                        className="font-semibold text-slate-900 hover:text-emerald-700"
                      >
                        {idea.title}
                      </Link>
                      <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <Badge color="slate">{categoryLabels[idea.category]}</Badge>
                        <span>👍 {idea._count.votes}</span>
                        <span>💬 {idea._count.comments}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="bg-gradient-to-br from-emerald-700 to-emerald-600 px-5 py-3">
                <h2 className="text-sm font-semibold text-white">Localisation</h2>
              </div>
              <div className="p-2">
                <CommuneMap lat={commune.centroidLat} lng={commune.centroidLng} name={commune.name} />
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-6">
              <h2 className="mb-2 text-sm font-bold tracking-wide text-emerald-800 uppercase">
                Participer
              </h2>
              <p className="text-sm text-emerald-900/80">
                Vous avez une idée, un signalement ou souhaitez vous impliquer dans la vie de{" "}
                {commune.name} ?
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <Link
                  href={`/idees/nouvelle?communeId=${commune.id}`}
                  className="rounded-full bg-emerald-700 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-emerald-600"
                >
                  Proposer une idée
                </Link>
                <Link
                  href={`/participation/nouvelle?communeId=${commune.id}&type=INITIATIVE`}
                  className="rounded-full border border-emerald-700 px-4 py-2 text-center text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
                >
                  Participer à une initiative
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
