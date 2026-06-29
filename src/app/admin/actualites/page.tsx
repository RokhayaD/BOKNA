import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteNews } from "@/actions/news";
import { AdminPageHeader } from "@/components/AdminPageHeader";
import { Badge } from "@/components/Badge";

const typeLabels: Record<string, string> = {
  NEWS: "Actualité",
  EVENT: "Événement",
  MEETING: "Réunion publique",
};

const typeColors: Record<string, "emerald" | "amber" | "slate"> = {
  NEWS: "emerald",
  EVENT: "amber",
  MEETING: "slate",
};

export default async function AdminNewsPage() {
  const news = await prisma.news.findMany({
    orderBy: { publishedAt: "desc" },
    include: { commune: true, region: true },
  });

  return (
    <div>
      <AdminPageHeader
        title="Actualités — Lu xew tay"
        description={`${news.length} publication(s).`}
        action={
          <Link
            href="/admin/actualites/nouvelle"
            className="rounded-full bg-emerald-700 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600"
          >
            + Publier une actualité
          </Link>
        }
      />

      <ul className="space-y-3">
        {news.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div>
              <Badge color={typeColors[item.type]}>{typeLabels[item.type]}</Badge>
              <p className="mt-1.5 font-semibold text-slate-900">{item.title}</p>
              <p className="text-xs text-slate-500">
                {item.commune?.name ?? item.region?.name ?? "National"} ·{" "}
                {item.publishedAt.toLocaleDateString("fr-FR")}
              </p>
            </div>
            <form action={deleteNews}>
              <input type="hidden" name="id" value={item.id} />
              <button className="rounded-full border border-red-200 px-4 py-1.5 text-sm font-semibold text-red-600 transition hover:bg-red-50">
                Supprimer
              </button>
            </form>
          </li>
        ))}
        {news.length === 0 && (
          <li className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
            Aucune actualité publiée.
          </li>
        )}
      </ul>
    </div>
  );
}
