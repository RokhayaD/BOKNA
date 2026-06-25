"use client";

import { useActionState } from "react";
import { createNews } from "@/actions/news";
import type { GeoTree } from "@/lib/geo";

export function NewsForm({ tree }: { tree: GeoTree }) {
  const [state, formAction, pending] = useActionState(createNews, {});

  return (
    <form action={formAction} className="max-w-2xl space-y-4">
      {state?.error && (
        <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Type</label>
        <select name="type" className="w-full rounded border border-slate-300 px-3 py-2 text-sm">
          <option value="NEWS">Actualité</option>
          <option value="EVENT">Événement</option>
          <option value="MEETING">Réunion publique / consultation</option>
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Titre</label>
        <input name="title" required minLength={5} className="w-full rounded border border-slate-300 px-3 py-2 text-sm" />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Contenu</label>
        <textarea
          name="content"
          required
          minLength={20}
          rows={6}
          className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Commune (optionnel)</label>
          <select name="communeId" className="w-full rounded border border-slate-300 px-3 py-2 text-sm">
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
          <select name="regionId" className="w-full rounded border border-slate-300 px-3 py-2 text-sm">
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
        <input type="date" name="eventDate" className="w-full rounded border border-slate-300 px-3 py-2 text-sm" />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded bg-emerald-700 px-4 py-2 font-semibold text-white hover:bg-emerald-600 disabled:opacity-60"
      >
        {pending ? "Publication..." : "Publier"}
      </button>
    </form>
  );
}
