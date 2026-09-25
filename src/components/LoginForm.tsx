"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

const inputClass =
  "w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none";

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
        <p className="rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-700 ring-1 ring-brand-200">
          Compte créé avec succès, vous pouvez vous connecter.
        </p>
      )}
      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
          {error}
        </p>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
        <input type="email" name="email" required className={inputClass} />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Mot de passe</label>
        <input type="password" name="password" required className={inputClass} />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-accent-600 px-4 py-3 font-semibold text-white shadow-lg shadow-accent-600/20 transition hover:-translate-y-0.5 hover:bg-accent-700 hover:shadow-xl disabled:opacity-60"
      >
        {pending ? "Connexion..." : "Se connecter"}
      </button>
    </form>
  );
}
