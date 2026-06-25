import { getGeoTree } from "@/lib/geo";
import { RegisterForm } from "@/components/RegisterForm";

export default async function RegisterPage() {
  const tree = await getGeoTree();

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Créer un compte citoyen</h1>
      <RegisterForm tree={tree} />
    </div>
  );
}
