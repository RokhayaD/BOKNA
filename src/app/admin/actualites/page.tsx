import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteNews } from "@/actions/news";

const typeLabels: Record<string, string> = {
  NEWS: "Actualité",
  EVENT: "Événement",
  MEETING: "Réunion publique",
};

export default async function AdminNewsPage() {
  const news = await prisma.news.findMany({
    orderBy: { publishedAt: "desc" },
    include: { commune: true, region: true },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Actualités — Lu xew tay</h1>
        <Link
          href="/admin/actualites/nouvelle"
          className="rounded bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
        >
          Publier une actualité
        </Link>
      </div>

      <ul className="space-y-3">
        {news.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4"
          >
            <div>
              <span className="rounded bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                {typeLabels[item.type]}
              </span>
              <p className="mt-1 font-medium text-slate-900">{item.title}</p>
              <p className="text-xs text-slate-500">
                {item.commune?.name ?? item.region?.name ?? "National"} ·{" "}
                {item.publishedAt.toLocaleDateString("fr-FR")}
              </p>
            </div>
            <form action={deleteNews}>
              <input type="hidden" name="id" value={item.id} />
              <button className="rounded border border-red-300 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50">
                Supprimer
              </button>
            </form>
          </li>
        ))}
        {news.length === 0 && <p className="text-sm text-slate-500">Aucune actualité publiée.</p>}
      </ul>
    </div>
  );
}
