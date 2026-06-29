import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/AdminPageHeader";

const statIcons = ["👤", "💡", "👍", "🏘️"];

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
  const maxRegionCount = Math.max(1, ...regionStats.map(([, count]) => count));
  const maxCommuneCount = Math.max(1, ...topCommunes.map((c) => c._count.ideas));

  const stats = [
    { label: "Utilisateurs", value: userCount },
    { label: "Idées soumises", value: ideaCount },
    { label: "Votes", value: voteCount },
    { label: "Communes actives", value: `${activeCommunes} / ${communeCount}` },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Tableau de bord"
        description="Vue d'ensemble de l'activité citoyenne sur la plateforme."
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s, i) => (
          <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-xl">
              {statIcons[i]}
            </div>
            <p className="mt-3 text-2xl font-bold text-slate-900">{s.value}</p>
            <p className="text-sm text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-bold text-slate-900">🏆 Communes les plus participatives</h2>
          <ol className="space-y-3">
            {topCommunes.map((c, i) => (
              <li key={c.id}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">
                    {i + 1}. {c.name}
                  </span>
                  <span className="font-semibold text-emerald-700">{c._count.ideas} idée(s)</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-emerald-600"
                    style={{ width: `${(c._count.ideas / maxCommuneCount) * 100}%` }}
                  />
                </div>
              </li>
            ))}
            {topCommunes.length === 0 && <p className="text-sm text-slate-500">Aucune donnée.</p>}
          </ol>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-bold text-slate-900">📍 Idées soumises par région</h2>
          <ol className="space-y-3">
            {regionStats.length === 0 && <p className="text-sm text-slate-500">Aucune donnée.</p>}
            {regionStats.map(([name, count]) => (
              <li key={name}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">{name}</span>
                  <span className="font-semibold text-emerald-700">{count}</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-emerald-600"
                    style={{ width: `${(count / maxRegionCount) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
