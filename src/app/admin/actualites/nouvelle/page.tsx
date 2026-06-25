import { getGeoTree } from "@/lib/geo";
import { NewsForm } from "@/components/NewsForm";

export default async function NewNewsPage() {
  const tree = await getGeoTree();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Publier une actualité</h1>
      <NewsForm tree={tree} />
    </div>
  );
}
