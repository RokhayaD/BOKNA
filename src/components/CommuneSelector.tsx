"use client";

import { useState } from "react";
import type { GeoTree } from "@/lib/geo";

function findDefaults(tree: GeoTree, defaultCommuneId?: string) {
  if (!defaultCommuneId) return { regionId: "", departmentId: "" };
  for (const region of tree) {
    for (const dept of region.departments) {
      if (dept.communes.some((c) => c.id === defaultCommuneId)) {
        return { regionId: region.id, departmentId: dept.id };
      }
    }
  }
  return { regionId: "", departmentId: "" };
}

export function CommuneSelector({
  tree,
  name = "communeId",
  defaultCommuneId,
}: {
  tree: GeoTree;
  name?: string;
  defaultCommuneId?: string;
}) {
  const [regionId, setRegionId] = useState(() => findDefaults(tree, defaultCommuneId).regionId);
  const [departmentId, setDepartmentId] = useState(
    () => findDefaults(tree, defaultCommuneId).departmentId
  );
  const [communeId, setCommuneId] = useState(defaultCommuneId ?? "");

  const region = tree.find((r) => r.id === regionId);
  const departments = region?.departments ?? [];
  const department = departments.find((d) => d.id === departmentId);
  const communes = department?.communes ?? [];

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Région</label>
        <select
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
          value={regionId}
          onChange={(e) => {
            setRegionId(e.target.value);
            setDepartmentId("");
            setCommuneId("");
          }}
        >
          <option value="">Sélectionner...</option>
          {tree.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Département</label>
        <select
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none disabled:bg-slate-100"
          value={departmentId}
          disabled={!regionId}
          onChange={(e) => {
            setDepartmentId(e.target.value);
            setCommuneId("");
          }}
        >
          <option value="">Sélectionner...</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Commune</label>
        <select
          name={name}
          required
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none disabled:bg-slate-100"
          value={communeId}
          disabled={!departmentId}
          onChange={(e) => setCommuneId(e.target.value)}
        >
          <option value="">Sélectionner...</option>
          {communes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
