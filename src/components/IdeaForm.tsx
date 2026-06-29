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
    <form action={formAction} className="space-y-5">
      {state?.error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
          {state.error}
        </p>
      )}

      <div>
        <p className="mb-1 text-sm font-medium text-slate-700">Commune concernée</p>
        <CommuneSelector tree={tree} defaultCommuneId={defaultCommuneId} />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Catégorie</label>
        <select
          name="category"
          required
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
        >
          {categories.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Titre</label>
        <input
          name="title"
          required
          minLength={5}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
        <textarea
          name="description"
          required
          minLength={20}
          rows={5}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-emerald-700 px-4 py-3 font-semibold text-white shadow-lg shadow-emerald-700/20 transition hover:-translate-y-0.5 hover:bg-emerald-600 hover:shadow-xl disabled:opacity-60"
      >
        {pending ? "Envoi..." : "Soumettre l'idée"}
      </button>
    </form>
  );
}
