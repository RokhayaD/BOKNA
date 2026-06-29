"use client";

import { useActionState } from "react";
import { createNews } from "@/actions/news";
import type { GeoTree } from "@/lib/geo";

const inputClass =
  "w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none";

export function NewsForm({ tree }: { tree: GeoTree }) {
  const [state, formAction, pending] = useActionState(createNews, {});

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
          {state.error}
        </p>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Type</label>
        <select name="type" className={inputClass}>
          <option value="NEWS">Actualité</option>
          <option value="EVENT">Événement</option>
          <option value="MEETING">Réunion publique / consultation</option>
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Titre</label>
        <input name="title" required minLength={5} className={inputClass} />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Contenu</label>
        <textarea name="content" required minLength={20} rows={6} className={inputClass} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Commune (optionnel)</label>
          <select name="communeId" className={inputClass}>
            <option value="">— Aucune (national) —</option>
            {tree.flatMap((region) =>
              region.departments.flatMap((dept) =>
                dept.communes.map((commune) => (
                  <option key={commune.id} value={commune.id}>
                    {region.name} · {commune.name}
                  </option>
                ))
              )
            )}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Région (optionnel)</label>
          <select name="regionId" className={inputClass}>
            <option value="">— Aucune (national) —</option>
            {tree.map((region) => (
              <option key={region.id} value={region.id}>
                {region.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Date de l&apos;événement / réunion (optionnel)
        </label>
        <input type="date" name="eventDate" className={inputClass} />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-emerald-700 px-6 py-2.5 font-semibold text-white shadow-sm transition hover:bg-emerald-600 disabled:opacity-60"
      >
        {pending ? "Publication..." : "Publier"}
      </button>
    </form>
  );
}
