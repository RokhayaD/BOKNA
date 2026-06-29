import Link from "next/link";
import { notFound } from "next/navigation";
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

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await prisma.news.findUnique({
    where: { id },
    include: { commune: true, region: true, author: { select: { name: true } } },
  });

  if (!item) notFound();

  return (
    <div>
      <PageHero
        eyebrow={typeLabels[item.type]}
        title={item.title}
        subtitle={`${item.commune?.name ?? item.region?.name ?? "National"} · publié le ${item.publishedAt.toLocaleDateString("fr-FR")}`}
        breadcrumb={
          <>
            <Link href="/actualites">Lu xew tay</Link>
            <span>/</span>
            <span className="text-white">{item.title}</span>
          </>
        }
      />

      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <Badge color={typeColors[item.type]}>{typeLabels[item.type]}</Badge>
            <span>publié par {item.author.name}</span>
            {item.eventDate && (
              <span>· Date de l&apos;événement : {item.eventDate.toLocaleDateString("fr-FR")}</span>
            )}
          </div>
          <p className="mt-5 whitespace-pre-wrap leading-relaxed text-slate-700">{item.content}</p>
        </div>
      </div>
    </div>
  );
}
