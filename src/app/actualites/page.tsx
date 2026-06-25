import Link from "next/link";
import { prisma } from "@/lib/prisma";

const typeLabels: Record<string, string> = {
  NEWS: "Actualité",
  EVENT: "Événement",
  MEETING: "Réunion publique",
};

export default async function NewsListPage() {
  const news = await prisma.news.findMany({
    orderBy: { publishedAt: "desc" },
    include: { commune: true, region: true },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900">Lu xew tay</h1>
      <p className="mt-1 text-slate-600">
        Actualités des communes, événements locaux et réunions publiques.
      </p>

      <ul className="mt-6 space-y-4">
        {news.map((item) => (
          <li key={item.id} className="rounded-xl border border-slate-200 bg-white p-5">
            <span className="rounded bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
              {typeLabels[item.type]}
            </span>
            <Link
              href={`/actualites/${item.id}`}
              className="mt-2 block font-semibold text-slate-900 hover:text-emerald-700"
            >
              {item.title}
            </Link>
            <p className="mt-1 line-clamp-2 text-sm text-slate-600">{item.content}</p>
            <p className="mt-2 text-xs text-slate-500">
              {item.commune?.name ?? item.region?.name ?? "National"} ·{" "}
              {item.publishedAt.toLocaleDateString("fr-FR")}
              {item.eventDate && ` · Date : ${item.eventDate.toLocaleDateString("fr-FR")}`}
            </p>
          </li>
        ))}
        {news.length === 0 && <p className="text-sm text-slate-500">Aucune actualité publiée.</p>}
      </ul>
    </div>
  );
}
