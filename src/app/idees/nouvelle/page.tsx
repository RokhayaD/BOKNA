import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getGeoTree } from "@/lib/geo";
import { IdeaForm } from "@/components/IdeaForm";
import { PageHero } from "@/components/PageHero";

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
    <div>
      <PageHero
        eyebrow="Boîte à idées"
        title="Proposer une idée"
        subtitle="Décrivez votre idée d'amélioration, votre signalement ou votre projet pour qu'elle soit étudiée par votre commune."
        breadcrumb={
          <>
            <span>Boîte à idées</span>
            <span>/</span>
            <span className="text-white">Nouvelle idée</span>
          </>
        }
      />
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <IdeaForm tree={tree} defaultCommuneId={communeId} />
        </div>
      </div>
    </div>
  );
}
