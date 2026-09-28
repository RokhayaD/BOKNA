"use client";

import { useActionState } from "react";
import { createIdea } from "@/actions/ideas";
import type { GeoTree } from "@/lib/geo";
import { CommuneSelector } from "@/components/CommuneSelector";
import { Alert } from "@/components/ui/Alert";
import { Icon } from "@/components/ui/Icon";
import { ideaCategories } from "@/lib/labels";

export function IdeaForm({ tree, defaultCommuneId }: { tree: GeoTree; defaultCommuneId?: string }) {
  const [state, formAction, pending] = useActionState(createIdea, {});

  return (
    <form action={formAction} className="space-y-8">
      {state?.error && <Alert tone="error">{state.error}</Alert>}

      <fieldset>
        <legend className="label">Commune concernée</legend>
        <CommuneSelector tree={tree} defaultCommuneId={defaultCommuneId} />
      </fieldset>

      <fieldset>
        <legend className="label">Type de proposition</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {Object.entries(ideaCategories).map(([value, cat], i) => (
            <label
              key={value}
              className="group relative flex cursor-pointer gap-3 rounded-xl border border-stone-300 bg-white p-4 transition hover:border-stone-400 has-checked:border-brand-700 has-checked:bg-brand-50/60 has-checked:ring-1 has-checked:ring-brand-700 has-focus-visible:ring-4 has-focus-visible:ring-brand-600/15"
            >
              <input
                type="radio"
                name="category"
                value={value}
                required
                defaultChecked={i === 0}
                className="peer sr-only"
              />
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-stone-500 transition peer-checked:bg-brand-700 peer-checked:text-white">
                <Icon name={cat.icon} className="size-[18px]" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-ink">{cat.long}</span>
                <span className="mt-0.5 block text-xs text-stone-500">{cat.description}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="idea-title" className="label">
          Titre
        </label>
        <input
          id="idea-title"
          name="title"
          required
          minLength={5}
          placeholder="Ex. : Installer un éclairage public avenue Blaise Diagne"
          className="input"
        />
        <p className="hint">Un titre court et précis, 5 caractères minimum.</p>
      </div>

      <div>
        <label htmlFor="idea-description" className="label">
          Description
        </label>
        <textarea
          id="idea-description"
          name="description"
          required
          minLength={20}
          rows={6}
          placeholder="Décrivez la situation actuelle, ce que vous proposez et les bénéfices attendus pour les habitants."
          className="input resize-y"
        />
        <p className="hint">20 caractères minimum.</p>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-stone-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-stone-500">Votre idée sera publiée après validation par l&apos;équipe de modération.</p>
        <button type="submit" disabled={pending} className="btn btn-accent btn-lg">
          {pending ? "Envoi en cours..." : "Soumettre l'idée"}
          {!pending && <Icon name="arrow-right" className="size-4" />}
        </button>
      </div>
    </form>
  );
}
