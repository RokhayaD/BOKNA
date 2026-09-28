"use client";

import { useActionState } from "react";
import { registerUser } from "@/actions/auth";
import type { GeoTree } from "@/lib/geo";
import { CommuneSelector } from "@/components/CommuneSelector";
import { Alert } from "@/components/ui/Alert";

export function RegisterForm({ tree }: { tree: GeoTree }) {
  const [state, formAction, pending] = useActionState(registerUser, {});

  return (
    <form action={formAction} className="space-y-5">
      {state?.error && <Alert tone="error">{state.error}</Alert>}

      <div>
        <label htmlFor="reg-name" className="label">
          Nom complet
        </label>
        <input id="reg-name" name="name" required autoComplete="name" className="input" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="reg-email" className="label">
            Email
          </label>
          <input
            id="reg-email"
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="vous@exemple.sn"
            className="input"
          />
        </div>
        <div>
          <label htmlFor="reg-password" className="label">
            Mot de passe
          </label>
          <input
            id="reg-password"
            type="password"
            name="password"
            required
            minLength={6}
            autoComplete="new-password"
            className="input"
          />
          <p className="hint">6 caractères minimum.</p>
        </div>
      </div>

      <fieldset>
        <legend className="label">Votre commune</legend>
        <CommuneSelector tree={tree} />
      </fieldset>

      <button type="submit" disabled={pending} className="btn btn-primary btn-lg w-full">
        {pending ? "Création en cours..." : "Créer mon compte"}
      </button>
    </form>
  );
}
