import Link from "next/link";
import { getGeoTree } from "@/lib/geo";
import { AdminPageHeader } from "@/components/AdminPageHeader";
import { Icon } from "@/components/ui/Icon";

export default async function AdminGeoPage() {
  const tree = await getGeoTree();

  return (
    <div>
      <AdminPageHeader
        title="Régions, départements et communes"
        description={`${tree.length} régions · ${tree.reduce((s, r) => s + r.departments.length, 0)} départements.`}
      />
      <div className="space-y-3">
        {tree.map((region) => (
          <details key={region.id} className="card group overflow-hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 transition hover:bg-stone-50 [&::-webkit-details-marker]:hidden">
              <span className="font-display text-base font-semibold text-ink">{region.name}</span>
              <span className="flex items-center gap-3 text-sm text-stone-500">
                <span className="hidden sm:inline">
                  {region.departments.length} départements ·{" "}
                  {region.departments.reduce((s, d) => s + d.communes.length, 0)} communes
                </span>
                <Icon name="chevron-down" className="size-4 transition group-open:rotate-180" />
              </span>
            </summary>
            <div className="flex flex-col gap-3 border-t border-stone-100 bg-paper/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="line-clamp-2 max-w-xl text-sm text-stone-600">
                {region.description ?? "Aucune présentation pour cette région."}
              </p>
              <Link href={`/admin/geo/regions/${region.id}`} className="btn btn-secondary btn-sm shrink-0">
                <Icon name="pencil" className="size-3.5" />
                Modifier la présentation
              </Link>
            </div>
            <div className="grid gap-6 border-t border-stone-100 p-5 sm:grid-cols-2">
              {region.departments.map((dept) => (
                <div key={dept.id}>
                  <p className="mb-2 flex items-center gap-2 text-xs font-semibold tracking-wide text-stone-500 uppercase">
                    <Icon name="layers" className="size-3.5" />
                    {dept.name}
                  </p>
                  <ul className="space-y-0.5">
                    {dept.communes.map((commune) => (
                      <li key={commune.id}>
                        <Link
                          href={`/admin/geo/${commune.id}`}
                          className="group/item flex items-center justify-between rounded-lg px-2.5 py-1.5 text-sm text-stone-700 transition hover:bg-brand-50 hover:text-brand-800"
                        >
                          {commune.name}
                          <span className="flex items-center gap-1 text-xs font-medium text-stone-400 group-hover/item:text-brand-700">
                            <Icon name="pencil" className="size-3.5" />
                            Modifier
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
