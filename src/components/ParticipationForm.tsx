"use client";

import { useActionState, useState } from "react";
import { createParticipationRequest } from "@/actions/participation";
import type { GeoTree } from "@/lib/geo";
import { CommuneSelector } from "@/components/CommuneSelector";
import { Alert } from "@/components/ui/Alert";
import { Icon, type IconName } from "@/components/ui/Icon";

const types: { value: "INITIATIVE" | "MAYOR_CANDIDACY"; title: string; text: string; icon: IconName }[] = [
  {
    value: "INITIATIVE",
    title: "Participer à une initiative",
    text: "Contribuer à un projet citoyen de votre commune.",
    icon: "sprout",
  },
  {
    value: "MAYOR_CANDIDACY",
    title: "Rejoindre l'équipe municipale",
    text: "Porter les couleurs de Bokna au conseil municipal.",
    icon: "landmark",
  },
];

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
    <form action={formAction} className="space-y-8">
      {state?.error && <Alert tone="error">{state.error}</Alert>}

      <fieldset>
        <legend className="label">Type de demande</legend>
        <div role="radiogroup" className="grid gap-3 sm:grid-cols-2">
          {types.map((t) => {
            const selected = type === t.value;
            return (
              <button
                key={t.value}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setType(t.value)}
                className={`flex gap-3 rounded-xl border p-4 text-left transition focus-visible:ring-4 focus-visible:ring-brand-600/15 focus-visible:outline-none ${
                  selected
                    ? "border-brand-700 bg-brand-50/60 ring-1 ring-brand-700"
                    : "border-stone-300 bg-white hover:border-stone-400"
                }`}
              >
                <span
                  className={`flex size-9 shrink-0 items-center justify-center rounded-lg transition ${
                    selected ? "bg-brand-700 text-white" : "bg-stone-100 text-stone-500"
                  }`}
                >
                  <Icon name={t.icon} className="size-[18px]" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-ink">{t.title}</span>
                  <span className="mt-0.5 block text-xs text-stone-500">{t.text}</span>
                </span>
              </button>
            );
          })}
        </div>
        <input type="hidden" name="type" value={type} />
      </fieldset>

      <fieldset>
        <legend className="label">Commune concernée</legend>
        <CommuneSelector tree={tree} defaultCommuneId={defaultCommuneId} />
      </fieldset>

      {type === "MAYOR_CANDIDACY" && (
        <fieldset className="grid gap-4 sm:grid-cols-3">
          <legend className="sr-only">Vos coordonnées</legend>
          <div>
            <label htmlFor="p-lastname" className="label">
              Nom
            </label>
            <input id="p-lastname" type="text" name="lastName" required autoComplete="family-name" className="input" />
          </div>
          <div>
            <label htmlFor="p-firstname" className="label">
              Prénom
            </label>
            <input id="p-firstname" type="text" name="firstName" required autoComplete="given-name" className="input" />
          </div>
          <div>
            <label htmlFor="p-phone" className="label">
              Téléphone
            </label>
            <input
              id="p-phone"
              type="tel"
              name="phone"
              required
              autoComplete="tel"
              placeholder="77 000 00 00"
              className="input"
            />
          </div>
        </fieldset>
      )}

      <div>
        <label htmlFor="p-message" className="label">
          {type === "MAYOR_CANDIDACY" ? "Votre motivation" : "Décrivez votre demande"}
        </label>
        <textarea
          id="p-message"
          name="message"
          required
          minLength={20}
          rows={6}
          placeholder={
            type === "MAYOR_CANDIDACY"
              ? "Présentez votre parcours, votre vision pour la commune et vos motivations à rejoindre l'équipe municipale..."
              : "Décrivez l'initiative à laquelle vous souhaitez participer ou contribuer..."
          }
          className="input resize-y"
        />
        <p className="hint">20 caractères minimum.</p>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-stone-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-stone-500">Votre demande sera étudiée par l&apos;administration.</p>
        <button type="submit" disabled={pending} className="btn btn-accent btn-lg">
          {pending ? "Envoi en cours..." : "Envoyer ma demande"}
          {!pending && <Icon name="arrow-right" className="size-4" />}
        </button>
      </div>
    </form>
  );
}
