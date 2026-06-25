import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

const typeLabels: Record<string, string> = {
  NEWS: "Actualité",
  EVENT: "Événement",
  MEETING: "Réunion publique",
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
    <div className="mx-auto max-w-3xl px-4 py-10">
      <nav className="mb-4 text-sm text-slate-500">
        <Link href="/actualites" className="hover:underline">
          Lu xew tay
        </Link>{" "}
        / <span className="text-slate-700">{item.title}</span>
      </nav>

      <span className="rounded bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
        {typeLabels[item.type]}
      </span>
      <h1 className="mt-2 text-2xl font-bold text-slate-900">{item.title}</h1>
      <p className="mt-1 text-sm text-slate-500">
        {item.commune?.name ?? item.region?.name ?? "National"} · publié par {item.author.name} le{" "}
        {item.publishedAt.toLocaleDateString("fr-FR")}
        {item.eventDate && ` · Date de l'événement : ${item.eventDate.toLocaleDateString("fr-FR")}`}
      </p>

      <p className="mt-6 whitespace-pre-wrap text-slate-700">{item.content}</p>
    </div>
  );
}
