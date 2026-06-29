import { Suspense } from "react";
import Link from "next/link";
import { LoginForm } from "@/components/LoginForm";
import { AuthCard } from "@/components/AuthCard";

export default function LoginPage() {
  return (
    <AuthCard title="Ensemble, la bokk." tagline="Rejoignez les citoyens qui font bouger leur commune.">
      <h1 className="text-2xl font-bold text-slate-900">Connexion</h1>
      <p className="mt-1 mb-6 text-sm text-slate-500">Accédez à votre espace citoyen Bokna.</p>
      <Suspense>
        <LoginForm />
      </Suspense>
      <p className="mt-6 text-sm text-slate-600">
        Pas encore de compte ?{" "}
        <Link href="/register" className="font-semibold text-emerald-700 hover:underline">
          Inscrivez-vous
        </Link>
      </p>
    </AuthCard>
  );
}
