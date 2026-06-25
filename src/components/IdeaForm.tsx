"use client";

import { useActionState } from "react";
import { createIdea } from "@/actions/ideas";
import type { GeoTree } from "@/lib/geo";
import { CommuneSelector } from "@/components/CommuneSelector";

const categories = [
  { value: "AMELIORATION", label: "Idée d'amélioration" },
  { value: "SIGNALEMENT", label: "Signalement de problème" },
  { value: "INVESTISSEMENT", label: "Suggestion d'investissement" },
  { value: "PROJET_COMMUNAUTAIRE", label: "Projet communautaire" },
];

export function IdeaForm({ tree, defaultCommuneId }: { tree: GeoTree; defaultCommuneId?: string }) {
  const [state, formAction, pending] = useActionState(createIdea, {});

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      )}

      <div>
        <p className="mb-1 text-sm font-medium text-slate-700">Commune concernée</p>
        <CommuneSelector tree={tree} defaultCommuneId={defaultCommuneId} />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Catégorie</label>
        <select name="category" required className="w-full rounded border border-slate-300 px-3 py-2 text-sm">
          {categories.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Titre</label>
        <input name="title" required minLength={5} className="w-full rounded border border-slate-300 px-3 py-2 text-sm" />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
        <textarea
          name="description"
          required
          minLength={20}
          rows={5}
          className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded bg-emerald-700 px-4 py-2 font-semibold text-white hover:bg-emerald-600 disabled:opacity-60"
      >
        {pending ? "Envoi..." : "Soumettre l'idée"}
      </button>
    </form>
  );
}
