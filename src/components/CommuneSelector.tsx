"use client";

import { useId, useState } from "react";
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
  const id = useId();
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
        <label htmlFor={`${id}-region`} className="label text-[13px] font-normal text-stone-600">
          Région
        </label>
        <select
          id={`${id}-region`}
          className="input"
          value={regionId}
          onChange={(e) => {
            setRegionId(e.target.value);
            setDepartmentId("");
            setCommuneId("");
          }}
        >
          <option value="">Sélectionner…</option>
          {tree.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor={`${id}-dept`} className="label text-[13px] font-normal text-stone-600">
          Département
        </label>
        <select
          id={`${id}-dept`}
          className="input"
          value={departmentId}
          disabled={!regionId}
          onChange={(e) => {
            setDepartmentId(e.target.value);
            setCommuneId("");
          }}
        >
          <option value="">Sélectionner…</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor={`${id}-commune`} className="label text-[13px] font-normal text-stone-600">
          Commune
        </label>
        <select
          id={`${id}-commune`}
          name={name}
          required
          className="input"
          value={communeId}
          disabled={!departmentId}
          onChange={(e) => setCommuneId(e.target.value)}
        >
          <option value="">Sélectionner…</option>
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
