import { Suspense } from "react";
import Link from "next/link";
import { LoginForm } from "@/components/LoginForm";
import { AuthCard } from "@/components/AuthCard";

export default function LoginPage() {
  return (
    <AuthCard title="Ensemble, la bokk." tagline="Rejoignez les citoyens qui font bouger leur commune.">
      <p className="eyebrow">Espace citoyen</p>
      <h1 className="mt-3 text-3xl font-semibold">Connexion</h1>
      <p className="mt-2 mb-8 text-sm text-stone-600">Heureux de vous revoir. Connectez-vous pour continuer.</p>
      <Suspense>
        <LoginForm />
      </Suspense>
      <p className="mt-8 border-t border-stone-100 pt-6 text-sm text-stone-600">
        Pas encore de compte ?{" "}
        <Link href="/register" className="link">
          Créer un compte citoyen
        </Link>
      </p>
    </AuthCard>
  );
}
