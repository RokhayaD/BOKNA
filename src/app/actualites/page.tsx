import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/PageHero";
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

export default async function NewsListPage() {
  const news = await prisma.news.findMany({
    orderBy: { publishedAt: "desc" },
    include: { commune: true, region: true },
  });

  return (
    <div>
      <PageHero
        eyebrow="Lu xew tay"
        title="Actualités & vie locale"
        subtitle="Actualités des communes, événements et réunions publiques pour rester connecté à votre territoire."
        breadcrumb={<span className="text-white">Lu xew tay</span>}
      />

      <div className="mx-auto max-w-4xl px-4 py-12">
        <ul className="space-y-4">
          {news.map((item) => (
            <li
              key={item.id}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-lg"
            >
              <Badge color={typeColors[item.type]}>{typeLabels[item.type]}</Badge>
              <Link
                href={`/actualites/${item.id}`}
                className="mt-2 block text-lg font-bold text-slate-900 group-hover:text-emerald-700"
              >
                {item.title}
              </Link>
              <p className="mt-1 line-clamp-2 text-sm text-slate-600">{item.content}</p>
              <p className="mt-2 text-xs font-medium text-slate-500">
                {item.commune?.name ?? item.region?.name ?? "National"} ·{" "}
                {item.publishedAt.toLocaleDateString("fr-FR")}
                {item.eventDate && ` · Date : ${item.eventDate.toLocaleDateString("fr-FR")}`}
              </p>
            </li>
          ))}
          {news.length === 0 && (
            <li className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
              Aucune actualité publiée.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
