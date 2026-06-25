import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getGeoTree } from "@/lib/geo";
import { IdeaForm } from "@/components/IdeaForm";

export default async function NewIdeaPage({
  searchParams,
}: {
  searchParams: Promise<{ communeId?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/idees/nouvelle");

  const { communeId } = await searchParams;
  const tree = await getGeoTree();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Proposer une idée</h1>
      <IdeaForm tree={tree} defaultCommuneId={communeId} />
    </div>
  );
}
