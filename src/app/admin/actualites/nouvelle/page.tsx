import { getGeoTree } from "@/lib/geo";
import { NewsForm } from "@/components/NewsForm";
import { AdminPageHeader } from "@/components/AdminPageHeader";

export default async function NewNewsPage() {
  const tree = await getGeoTree();

  return (
    <div>
      <AdminPageHeader title="Publier une actualité" />
      <div className="max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <NewsForm tree={tree} />
      </div>
    </div>
  );
}
