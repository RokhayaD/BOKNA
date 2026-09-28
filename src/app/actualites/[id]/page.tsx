import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader, type MetaItem } from "@/components/PageHeader";
import { Icon } from "@/components/ui/Icon";
import { formatDate, newsTypes } from "@/lib/labels";

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

  const meta: MetaItem[] = [
    { icon: "map-pin", label: item.commune?.name ?? item.region?.name ?? "National" },
    { icon: "clock", label: `Publié le ${formatDate(item.publishedAt)}` },
    { icon: "user", label: item.author.name },
  ];

  return (
    <div>
      <PageHeader
        eyebrow={newsTypes[item.type].label}
        title={item.title}
        breadcrumb={[{ label: "Lu xew tay", href: "/actualites" }, { label: item.title }]}
        meta={meta}
      />

      <div className="container-page py-10 sm:py-12">
        <div className="mx-auto max-w-3xl">
          {item.eventDate && (
            <div className="mb-6 flex items-center gap-4 rounded-2xl border border-accent-600/15 bg-accent-50 p-5">
              <span className="icon-tile bg-white text-accent-700 ring-accent-600/15">
                <Icon name="calendar" className="size-5" />
              </span>
              <div>
                <p className="text-xs font-semibold tracking-wide text-accent-800 uppercase">
                  {item.type === "MEETING" ? "Date de la réunion" : "Date de l'événement"}
                </p>
                <p className="font-display text-lg font-semibold text-ink">
                  {formatDate(item.eventDate, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
            </div>
          )}

          <article className="card p-6 sm:p-10">
            <p className="text-[15px] leading-[1.8] whitespace-pre-wrap text-stone-700 sm:text-base">{item.content}</p>
          </article>

          <Link href="/actualites" className="btn btn-ghost mt-6 -ml-3">
            <Icon name="arrow-left" className="size-4" />
            Toutes les actualités
          </Link>
        </div>
      </div>
    </div>
  );
}
