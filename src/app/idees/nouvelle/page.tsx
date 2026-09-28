import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getGeoTree } from "@/lib/geo";
import { IdeaForm } from "@/components/IdeaForm";
import { PageHeader } from "@/components/PageHeader";
import { FormTips } from "@/components/FormTips";

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
      <PageHeader
        eyebrow="Boîte à idées"
        title="Proposer une idée"
        subtitle="Décrivez votre idée d'amélioration, votre signalement ou votre projet pour qu'elle soit étudiée par votre commune."
        breadcrumb={[{ label: "Boîte à idées", href: "/idees" }, { label: "Nouvelle idée" }]}
      />
      <div className="container-page grid grid-cols-1 gap-8 py-10 sm:py-12 lg:grid-cols-3">
        <div className="card p-6 sm:p-8 lg:col-span-2">
          <IdeaForm tree={tree} defaultCommuneId={communeId} />
        </div>
        <FormTips
          title="Pour une idée qui compte"
          tips={[
            "Soyez concret : un lieu, un problème, une solution.",
            "Expliquez ce que votre idée change pour les habitants.",
            "Une idée par proposition, pour faciliter le soutien.",
            "Restez respectueux : les idées sont relues avant publication.",
          ]}
        />
      </div>
    </div>
  );
}
