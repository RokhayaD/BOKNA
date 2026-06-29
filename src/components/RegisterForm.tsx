"use client";

import { useActionState } from "react";
import { registerUser } from "@/actions/auth";
import type { GeoTree } from "@/lib/geo";
import { CommuneSelector } from "@/components/CommuneSelector";

const inputClass =
  "w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none";

export function RegisterForm({ tree }: { tree: GeoTree }) {
  const [state, formAction, pending] = useActionState(registerUser, {});

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
          {state.error}
        </p>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Nom complet</label>
        <input name="name" required className={inputClass} />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
        <input type="email" name="email" required className={inputClass} />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Mot de passe</label>
        <input type="password" name="password" required minLength={6} className={inputClass} />
      </div>

      <div>
        <p className="mb-1 text-sm font-medium text-slate-700">Votre commune</p>
        <CommuneSelector tree={tree} />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-emerald-700 px-4 py-3 font-semibold text-white shadow-lg shadow-emerald-700/20 transition hover:-translate-y-0.5 hover:bg-emerald-600 hover:shadow-xl disabled:opacity-60"
      >
        {pending ? "Création en cours..." : "Créer mon compte"}
      </button>
    </form>
  );
}
