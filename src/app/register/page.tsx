import Link from "next/link";
import { getGeoTree } from "@/lib/geo";
import { RegisterForm } from "@/components/RegisterForm";
import { AuthCard } from "@/components/AuthCard";

export default async function RegisterPage() {
  const tree = await getGeoTree();

  return (
    <AuthCard
      title="La bokna, c'est vous."
      tagline="Créez votre compte citoyen et participez à la vie de votre commune dès aujourd'hui."
    >
      <p className="eyebrow">Espace citoyen</p>
      <h1 className="mt-3 text-3xl font-semibold">Créer un compte</h1>
      <p className="mt-2 mb-8 text-sm text-stone-600">Quelques informations pour commencer, c&apos;est gratuit.</p>
      <RegisterForm tree={tree} />
      <p className="mt-8 border-t border-stone-100 pt-6 text-sm text-stone-600">
        Déjà inscrit ?{" "}
        <Link href="/login" className="link">
          Se connecter
        </Link>
      </p>
    </AuthCard>
  );
}
