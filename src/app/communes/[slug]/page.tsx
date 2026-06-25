import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CommuneMapLoader as CommuneMap } from "@/components/CommuneMapLoader";

const categoryLabels: Record<string, string> = {
  AMELIORATION: "Amélioration",
  SIGNALEMENT: "Signalement",
  INVESTISSEMENT: "Investissement",
  PROJET_COMMUNAUTAIRE: "Projet communautaire",
};

const projectStatusLabels: Record<string, string> = {
  PLANNED: "Planifié",
  ONGOING: "En cours",
  DONE: "Terminé",
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

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <nav className="mb-4 text-sm text-slate-500">
        <Link href="/" className="hover:underline">
          Régions
        </Link>{" "}
        /{" "}
        <Link href={`/regions/${commune.department.region.slug}`} className="hover:underline">
          {commune.department.region.name}
        </Link>{" "}
        /{" "}
        <Link
          href={`/regions/${commune.department.region.slug}/${commune.department.slug}`}
          className="hover:underline"
        >
          {commune.department.name}
        </Link>{" "}
        / <span className="text-slate-700">{commune.name}</span>
      </nav>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{commune.name}</h1>
          <p className="mt-1 text-slate-600">
            Commune du département de {commune.department.name}, région de{" "}
            {commune.department.region.name}.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/idees/nouvelle?communeId=${commune.id}`}
            className="rounded bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
          >
            Proposer une idée
          </Link>
          <Link
            href={`/participation/nouvelle?communeId=${commune.id}&type=INITIATIVE`}
            className="rounded border border-emerald-700 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
          >
            Participer à une initiative
          </Link>
          <Link
            href={`/participation/nouvelle?communeId=${commune.id}&type=MAYOR_CANDIDACY`}
            className="rounded border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Me présenter comme maire (coalition Bokna)
          </Link>
        </div>
      </div>

      <section className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="mb-2 font-semibold text-slate-900">Présentation</h2>
            <p className="text-sm text-slate-600">
              {commune.description ?? "Aucune présentation disponible pour le moment."}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="mb-3 font-semibold text-slate-900">Projets en cours</h2>
            {commune.projects.length === 0 ? (
              <p className="text-sm text-slate-500">Aucun projet référencé pour le moment.</p>
            ) : (
              <ul className="space-y-3">
                {commune.projects.map((project) => (
                  <li key={project.id} className="border-l-2 border-emerald-600 pl-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-slate-900">{project.title}</span>
                      <span className="rounded bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                        {projectStatusLabels[project.status]}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">{project.description}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">Idées récentes</h2>
              <Link href={`/idees?communeId=${commune.id}`} className="text-sm text-emerald-700 hover:underline">
                Voir tout
              </Link>
            </div>
            {commune.ideas.length === 0 ? (
              <p className="text-sm text-slate-500">Aucune idée publiée pour cette commune.</p>
            ) : (
              <ul className="space-y-3">
                {commune.ideas.map((idea) => (
                  <li key={idea.id}>
                    <Link href={`/idees/${idea.id}`} className="font-medium text-slate-900 hover:text-emerald-700">
                      {idea.title}
                    </Link>
                    <p className="text-xs text-slate-500">
                      {categoryLabels[idea.category]} · {idea._count.votes} soutien(s) ·{" "}
                      {idea._count.comments} commentaire(s)
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="mb-2 font-semibold text-slate-900">Informations administratives</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500">Région</dt>
                <dd className="font-medium text-slate-900">{commune.department.region.name}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Département</dt>
                <dd className="font-medium text-slate-900">{commune.department.name}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Population</dt>
                <dd className="font-medium text-slate-900">
                  {commune.population ? commune.population.toLocaleString("fr-FR") : "N/D"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Citoyens inscrits</dt>
                <dd className="font-medium text-slate-900">{commune._count.users}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="mb-2 font-semibold text-slate-900">Localisation</h2>
            <CommuneMap lat={commune.centroidLat} lng={commune.centroidLng} name={commune.name} />
          </div>
        </div>
      </section>
    </div>
  );
}
