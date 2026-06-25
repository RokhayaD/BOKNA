"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const justRegistered = searchParams.get("registered") === "1";
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirect: false,
      });

      if (result?.error) {
        setError("Email ou mot de passe incorrect.");
        return;
      }
      router.push(callbackUrl);
      router.refresh();
    });
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      {justRegistered && (
        <p className="rounded bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          Compte créé avec succès, vous pouvez vous connecter.
        </p>
      )}
      {error && <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

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
          className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded bg-emerald-700 px-4 py-2 font-semibold text-white hover:bg-emerald-600 disabled:opacity-60"
      >
        {pending ? "Connexion..." : "Se connecter"}
      </button>
    </form>
  );
}
