import { getGeoTree } from "@/lib/geo";
import { NewsForm } from "@/components/NewsForm";
import { AdminPageHeader } from "@/components/AdminPageHeader";

export default async function NewNewsPage() {
  const tree = await getGeoTree();

  return (
    <div>
      <AdminPageHeader
        title="Publier une actualité"
        description="Actualité, événement ou réunion publique, à l'échelle nationale, régionale ou communale."
        back={{ href: "/admin/actualites", label: "Actualités" }}
      />
      <div className="card max-w-3xl p-6 sm:p-8">
        <NewsForm tree={tree} />
      </div>
    </div>
  );
}
