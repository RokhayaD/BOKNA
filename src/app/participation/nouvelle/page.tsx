import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getGeoTree } from "@/lib/geo";
import { ParticipationForm } from "@/components/ParticipationForm";
import { PageHeader } from "@/components/PageHeader";
import { FormTips } from "@/components/FormTips";

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
      <PageHeader
        eyebrow="Vie municipale"
        title="Participer à la vie municipale"
        subtitle="Rejoignez une initiative citoyenne ou portez les couleurs de la coalition Bokna au sein de l'équipe municipale de votre commune."
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Participation" }]}
      />
      <div className="container-page grid grid-cols-1 gap-8 py-10 sm:py-12 lg:grid-cols-3">
        <div className="card p-6 sm:p-8 lg:col-span-2">
          <ParticipationForm tree={tree} defaultCommuneId={communeId} defaultType={type} />
        </div>
        <FormTips
          title="Comment ça se passe"
          tips={[
            "Votre demande est transmise à l'administration de Bokna.",
            "Elle est étudiée avec attention, au cas par cas.",
            "Vous suivez son statut depuis votre espace citoyen.",
          ]}
        />
      </div>
    </div>
  );
}
