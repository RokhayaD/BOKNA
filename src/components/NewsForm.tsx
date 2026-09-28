"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createNews } from "@/actions/news";
import type { GeoTree } from "@/lib/geo";
import { Alert } from "@/components/ui/Alert";

export function NewsForm({ tree }: { tree: GeoTree }) {
  const [state, formAction, pending] = useActionState(createNews, {});

  return (
    <form action={formAction} className="space-y-6">
      {state?.error && <Alert tone="error">{state.error}</Alert>}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="news-type" className="label">
            Type
          </label>
          <select id="news-type" name="type" className="input">
            <option value="NEWS">Actualité</option>
            <option value="EVENT">Événement</option>
            <option value="MEETING">Réunion publique / consultation</option>
          </select>
        </div>
        <div>
          <label htmlFor="news-date" className="label">
            Date de l&apos;événement <span className="font-normal text-stone-400">(optionnel)</span>
          </label>
          <input id="news-date" type="date" name="eventDate" className="input" />
        </div>
      </div>

      <div>
        <label htmlFor="news-title" className="label">
          Titre
        </label>
        <input id="news-title" name="title" required minLength={5} className="input" />
      </div>

      <div>
        <label htmlFor="news-content" className="label">
          Contenu
        </label>
        <textarea id="news-content" name="content" required minLength={20} rows={8} className="input resize-y" />
      </div>

      <fieldset className="rounded-xl bg-paper p-4 ring-1 ring-stone-200/70 sm:p-5">
        <legend className="sr-only">Portée</legend>
        <p className="text-sm font-medium text-ink">Portée</p>
        <p className="mt-0.5 mb-4 text-xs text-stone-500">Laissez vide pour une actualité nationale.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="news-commune" className="label text-[13px] font-normal text-stone-600">
              Commune
            </label>
            <select id="news-commune" name="communeId" className="input">
              <option value="">Aucune (national)</option>
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
            <label htmlFor="news-region" className="label text-[13px] font-normal text-stone-600">
              Région
            </label>
            <select id="news-region" name="regionId" className="input">
              <option value="">Aucune (national)</option>
              {tree.map((region) => (
                <option key={region.id} value={region.id}>
                  {region.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </fieldset>

      <div className="flex gap-3 border-t border-stone-100 pt-6">
        <button type="submit" disabled={pending} className="btn btn-primary">
          {pending ? "Publication..." : "Publier"}
        </button>
        <Link href="/admin/actualites" className="btn btn-secondary">
          Annuler
        </Link>
      </div>
    </form>
  );
}
