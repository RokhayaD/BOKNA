import { Suspense } from "react";
import Link from "next/link";
import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Connexion</h1>
      <Suspense>
        <LoginForm />
      </Suspense>
      <p className="mt-4 text-sm text-slate-600">
        Pas encore de compte ?{" "}
        <Link href="/register" className="font-medium text-emerald-700 hover:underline">
          Inscrivez-vous
        </Link>
      </p>
    </div>
  );
}
