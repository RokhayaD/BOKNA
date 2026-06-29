"use client";

import { useActionState, useState } from "react";
import { createParticipationRequest } from "@/actions/participation";
import type { GeoTree } from "@/lib/geo";
import { CommuneSelector } from "@/components/CommuneSelector";

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
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Type de demande</label>
        <select
          name="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="INITIATIVE">Participer à une initiative citoyenne / municipale</option>
          <option value="MAYOR_CANDIDACY">Je veux devenir membre de l&apos;équipe municipale</option>
        </select>
      </div>

      <div>
        <p className="mb-1 text-sm font-medium text-slate-700">Commune concernée</p>
        <CommuneSelector tree={tree} defaultCommuneId={defaultCommuneId} />
      </div>

      {type === "MAYOR_CANDIDACY" && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Nom</label>
            <input
              type="text"
              name="lastName"
              required
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Prénom</label>
            <input
              type="text"
              name="firstName"
              required
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Numéro de téléphone</label>
            <input
              type="tel"
              name="phone"
              required
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
            />
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
          className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded bg-emerald-700 px-4 py-2 font-semibold text-white hover:bg-emerald-600 disabled:opacity-60"
      >
        {pending ? "Envoi..." : "Envoyer ma demande"}
      </button>
    </form>
  );
}
