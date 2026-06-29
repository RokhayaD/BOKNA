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
      <h1 className="text-2xl font-bold text-slate-900">Créer un compte citoyen</h1>
      <p className="mt-1 mb-6 text-sm text-slate-500">Quelques informations pour commencer.</p>
      <RegisterForm tree={tree} />
    </AuthCard>
  );
}
