import Link from "next/link";
import { getGeoTree } from "@/lib/geo";
import { AdminPageHeader } from "@/components/AdminPageHeader";

export default async function AdminGeoPage() {
  const tree = await getGeoTree();

  return (
    <div>
      <AdminPageHeader
        title="Régions, départements et communes"
        description={`${tree.length} régions · ${tree.reduce((s, r) => s + r.departments.length, 0)} départements.`}
      />
      <div className="space-y-4">
        {tree.map((region) => (
          <details key={region.id} className="group rounded-2xl border border-slate-200 bg-white shadow-sm">
            <summary className="flex cursor-pointer items-center justify-between px-5 py-4 font-bold text-slate-900">
              <span>{region.name}</span>
              <span className="text-sm font-normal text-slate-500">
                {region.departments.length} départements ·{" "}
                {region.departments.reduce((s, d) => s + d.communes.length, 0)} communes
              </span>
            </summary>
            <div className="grid gap-4 border-t border-slate-100 p-5 sm:grid-cols-2">
              {region.departments.map((dept) => (
                <div key={dept.id}>
                  <p className="mb-1.5 text-sm font-semibold text-slate-700">{dept.name}</p>
                  <ul className="space-y-1">
                    {dept.communes.map((commune) => (
                      <li
                        key={commune.id}
                        className="flex items-center justify-between rounded-lg px-2 py-1 text-sm transition hover:bg-emerald-50"
                      >
                        <span className="text-slate-600">{commune.name}</span>
                        <Link
                          href={`/admin/geo/${commune.id}`}
                          className="text-xs font-semibold text-emerald-700 hover:underline"
                        >
                          Modifier
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
