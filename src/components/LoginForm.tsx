"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Alert } from "@/components/ui/Alert";

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
    <form action={handleSubmit} className="space-y-5">
      {justRegistered && <Alert tone="success">Compte créé avec succès, vous pouvez vous connecter.</Alert>}
      {error && <Alert tone="error">{error}</Alert>}

      <div>
        <label htmlFor="login-email" className="label">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="vous@exemple.sn"
          className="input"
        />
      </div>

      <div>
        <label htmlFor="login-password" className="label">
          Mot de passe
        </label>
        <input
          id="login-password"
          type="password"
          name="password"
          required
          autoComplete="current-password"
          className="input"
        />
      </div>

      <button type="submit" disabled={pending} className="btn btn-primary btn-lg w-full">
        {pending ? "Connexion..." : "Se connecter"}
      </button>
    </form>
  );
}
