import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/AdminPageHeader";
import { Icon, type IconName } from "@/components/ui/Icon";

function RankedBars({ rows, max }: { rows: { key: string; label: string; value: number }[]; max: number }) {
  if (rows.length === 0) return <p className="text-sm text-stone-500">Aucune donnée pour le moment.</p>;
  return (
    <ol className="space-y-4">
      {rows.map((row, i) => (
        <li key={row.key}>
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="flex min-w-0 items-center gap-2.5">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-stone-100 font-mono text-[11px] font-semibold text-stone-600">
                {i + 1}
              </span>
              <span className="truncate font-medium text-ink">{row.label}</span>
            </span>
            <span className="font-semibold text-ink tabular-nums">{row.value}</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-stone-100">
            <div
              className={`h-full rounded-full ${i === 0 ? "bg-brand-700" : "bg-brand-400"}`}
              style={{ width: `${(row.value / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ol>
  );
}

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

  const stats: { label: string; value: string | number; icon: IconName }[] = [
    { label: "Utilisateurs", value: userCount, icon: "users" },
    { label: "Idées soumises", value: ideaCount, icon: "lightbulb" },
    { label: "Soutiens", value: voteCount, icon: "thumbs-up" },
    { label: "Communes actives", value: `${activeCommunes} / ${communeCount}`, icon: "building" },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Tableau de bord"
        description="Vue d'ensemble de l'activité citoyenne sur la plateforme."
      />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-stone-500">{s.label}</p>
              <Icon name={s.icon} className="size-[18px] text-stone-400" />
            </div>
            <p className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink tabular-nums">
              {typeof s.value === "number" ? s.value.toLocaleString("fr-FR") : s.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <section className="card p-6">
          <div className="mb-6 flex items-center gap-3">
            <span className="icon-tile size-9">
              <Icon name="award" className="size-[18px]" />
            </span>
            <h2 className="text-base font-semibold">Communes les plus participatives</h2>
          </div>
          <RankedBars
            max={maxCommuneCount}
            rows={topCommunes
              .filter((c) => c._count.ideas > 0)
              .map((c) => ({ key: c.id, label: c.name, value: c._count.ideas }))}
          />
        </section>

        <section className="card p-6">
          <div className="mb-6 flex items-center gap-3">
            <span className="icon-tile size-9">
              <Icon name="map-pin" className="size-[18px]" />
            </span>
            <h2 className="text-base font-semibold">Idées soumises par région</h2>
          </div>
          <RankedBars
            max={maxRegionCount}
            rows={regionStats.map(([name, count]) => ({ key: name, label: name, value: count }))}
          />
        </section>
      </div>
    </div>
  );
}
