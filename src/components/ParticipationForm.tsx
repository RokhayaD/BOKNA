"use client";

import { useActionState, useState } from "react";
import { createParticipationRequest } from "@/actions/participation";
import type { GeoTree } from "@/lib/geo";
import { CommuneSelector } from "@/components/CommuneSelector";

const inputClass =
  "w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none";

export function ParticipationForm({
  tree,
  defaultCommuneId,
  defaultType,
}: {
  tree: GeoTree;
  defaultCommuneId?: string;
  defaultType?: string;
}) {
  const [state, formAction, pending] = useActionState(createParticipationRequest, {});
  const [type, setType] = useState(defaultType === "MAYOR_CANDIDACY" ? "MAYOR_CANDIDACY" : "INITIATIVE");

  return (
    <form action={formAction} className="space-y-5">
      {state?.error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
          {state.error}
        </p>
      )}

      <div className="grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setType("INITIATIVE")}
          className={`rounded-xl border p-3 text-left text-sm font-medium transition ${
            type === "INITIATIVE"
              ? "border-emerald-500 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-500"
              : "border-slate-200 text-slate-600 hover:border-slate-300"
          }`}
        >
          🤝 Participer à une initiative
        </button>
        <button
          type="button"
          onClick={() => setType("MAYOR_CANDIDACY")}
          className={`rounded-xl border p-3 text-left text-sm font-medium transition ${
            type === "MAYOR_CANDIDACY"
              ? "border-emerald-500 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-500"
              : "border-slate-200 text-slate-600 hover:border-slate-300"
          }`}
        >
          🏛️ Équipe municipale
        </button>
        <input type="hidden" name="type" value={type} />
      </div>

      <div>
        <p className="mb-1 text-sm font-medium text-slate-700">Commune concernée</p>
        <CommuneSelector tree={tree} defaultCommuneId={defaultCommuneId} />
      </div>

      {type === "MAYOR_CANDIDACY" && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Nom</label>
            <input type="text" name="lastName" required className={inputClass} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Prénom</label>
            <input type="text" name="firstName" required className={inputClass} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Numéro de téléphone</label>
            <input type="tel" name="phone" required className={inputClass} />
          </div>
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          {type === "MAYOR_CANDIDACY" ? "Votre motivation" : "Décrivez votre demande"}
        </label>
        <textarea
          name="message"
          required
          minLength={20}
          rows={6}
          placeholder={
            type === "MAYOR_CANDIDACY"
              ? "Présentez votre parcours, votre vision pour la commune et vos motivations à rejoindre l'équipe municipale..."
              : "Décrivez l'initiative à laquelle vous souhaitez participer ou contribuer..."
          }
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-emerald-700 px-4 py-3 font-semibold text-white shadow-lg shadow-emerald-700/20 transition hover:-translate-y-0.5 hover:bg-emerald-600 hover:shadow-xl disabled:opacity-60"
      >
        {pending ? "Envoi..." : "Envoyer ma demande"}
      </button>
    </form>
  );
}
