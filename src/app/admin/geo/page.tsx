import Link from "next/link";
import { getGeoTree } from "@/lib/geo";

export default async function AdminGeoPage() {
  const tree = await getGeoTree();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Régions, départements et communes</h1>
      <div className="space-y-6">
        {tree.map((region) => (
          <div key={region.id} className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="font-semibold text-slate-900">{region.name}</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {region.departments.map((dept) => (
                <div key={dept.id}>
                  <p className="text-sm font-medium text-slate-700">{dept.name}</p>
                  <ul className="mt-1 space-y-1">
                    {dept.communes.map((commune) => (
                      <li key={commune.id} className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">{commune.name}</span>
                        <Link
                          href={`/admin/geo/${commune.id}`}
                          className="text-xs font-medium text-emerald-700 hover:underline"
                        >
                          Modifier
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
