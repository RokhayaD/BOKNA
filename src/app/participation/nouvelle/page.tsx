import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getGeoTree } from "@/lib/geo";
import { ParticipationForm } from "@/components/ParticipationForm";
import { PageHero } from "@/components/PageHero";

export default async function NewParticipationPage({
  searchParams,
}: {
  searchParams: Promise<{ communeId?: string; type?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/participation/nouvelle");

  const { communeId, type } = await searchParams;
  const tree = await getGeoTree();

  return (
    <div>
      <PageHero
        eyebrow="Vie municipale"
        title="Participer à la vie municipale"
        subtitle="Rejoignez une initiative citoyenne ou portez les couleurs de la coalition Bokna au sein de l'équipe municipale de votre commune."
        breadcrumb={<span className="text-white">Participation</span>}
      />
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <ParticipationForm tree={tree} defaultCommuneId={communeId} defaultType={type} />
        </div>
      </div>
    </div>
  );
}
