import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [userCount, ideaCount, voteCount, communeCount, activeCommunes, topCommunes, ideasForRegionStats] =
    await Promise.all([
      prisma.user.count(),
      prisma.idea.count(),
      prisma.ideaVote.count(),
      prisma.commune.count(),
      prisma.commune.count({ where: { ideas: { some: {} } } }),
      prisma.commune.findMany({
        include: { _count: { select: { ideas: true } } },
        orderBy: { ideas: { _count: "desc" } },
        take: 5,
      }),
      prisma.idea.findMany({
        select: { commune: { select: { department: { select: { region: { select: { name: true } } } } } } },
      }),
    ]);

  const ideasByRegion = new Map<string, number>();
  for (const idea of ideasForRegionStats) {
    const regionName = idea.commune.department.region.name;
    ideasByRegion.set(regionName, (ideasByRegion.get(regionName) ?? 0) + 1);
  }
  const regionStats = [...ideasByRegion.entries()].sort((a, b) => b[1] - a[1]);

  const stats = [
    { label: "Utilisateurs", value: userCount },
    { label: "Idées soumises", value: ideaCount },
    { label: "Votes", value: voteCount },
    { label: "Communes actives", value: `${activeCommunes} / ${communeCount}` },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Tableau de bord statistique</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-2xl font-bold text-emerald-700">{s.value}</p>
            <p className="text-sm text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="mb-3 font-semibold text-slate-900">Communes les plus participatives</h2>
          <ol className="space-y-2 text-sm">
            {topCommunes.map((c, i) => (
              <li key={c.id} className="flex items-center justify-between">
                <span>
                  {i + 1}. {c.name}
                </span>
                <span className="font-medium text-slate-700">{c._count.ideas} idée(s)</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="mb-3 font-semibold text-slate-900">Idées soumises par région</h2>
          <ol className="space-y-2 text-sm">
            {regionStats.length === 0 && <p className="text-slate-500">Aucune donnée.</p>}
            {regionStats.map(([name, count]) => (
              <li key={name} className="flex items-center justify-between">
                <span>{name}</span>
                <span className="font-medium text-slate-700">{count}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
