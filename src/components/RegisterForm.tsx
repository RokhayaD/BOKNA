"use client";

import { useActionState } from "react";
import { registerUser } from "@/actions/auth";
import type { GeoTree } from "@/lib/geo";
import { CommuneSelector } from "@/components/CommuneSelector";

export function RegisterForm({ tree }: { tree: GeoTree }) {
  const [state, formAction, pending] = useActionState(registerUser, {});

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Nom complet</label>
        <input
          name="name"
          required
          className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
        <input
          type="email"
          name="email"
          required
          className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Mot de passe</label>
        <input
          type="password"
          name="password"
          required
          minLength={6}
          className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <p className="mb-1 text-sm font-medium text-slate-700">Votre commune</p>
        <CommuneSelector tree={tree} />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded bg-emerald-700 px-4 py-2 font-semibold text-white hover:bg-emerald-600 disabled:opacity-60"
      >
        {pending ? "Création en cours..." : "Créer mon compte"}
      </button>
    </form>
  );
}
