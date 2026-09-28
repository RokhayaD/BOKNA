import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate, newsTypes } from "@/lib/labels";

export default async function NewsListPage() {
  const news = await prisma.news.findMany({
    orderBy: { publishedAt: "desc" },
    include: { commune: true, region: true },
  });

  return (
    <div>
      <PageHeader
        eyebrow="Lu xew tay"
        title="Actualités & vie locale"
        subtitle="Actualités des communes, événements et réunions publiques pour rester connecté à votre territoire."
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Lu xew tay" }]}
      />

      <div className="container-page py-10 sm:py-12">
        {news.length === 0 ? (
          <EmptyState icon="newspaper" title="Aucune actualité publiée">
            Les actualités, événements et réunions publiques apparaîtront ici.
          </EmptyState>
        ) : (
          <ul className="mx-auto max-w-4xl space-y-4">
            {news.map((item) => (
              <li key={item.id}>
                <Link href={`/actualites/${item.id}`} className="card card-interactive group flex gap-5 p-5 sm:gap-6 sm:p-6">
                  <time
                    dateTime={item.publishedAt.toISOString()}
                    className="flex w-14 shrink-0 flex-col items-center justify-center self-start rounded-xl border border-stone-200 bg-paper py-2.5 sm:w-16"
                  >
                    <span className="font-display text-2xl leading-none font-semibold text-ink">
                      {item.publishedAt.getDate()}
                    </span>
                    <span className="mt-1 text-[11px] font-semibold tracking-wide text-stone-500 uppercase">
                      {formatDate(item.publishedAt, { month: "short" }).replace(".", "")}
                    </span>
                  </time>
                  <div className="min-w-0 flex-1">
                    <Badge tone={newsTypes[item.type].tone} dot>
                      {newsTypes[item.type].label}
                    </Badge>
                    <h2 className="mt-2.5 text-lg leading-snug font-semibold group-hover:text-brand-700">{item.title}</h2>
                    <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-stone-600">{item.content}</p>
                    <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone-500">
                      <span className="flex items-center gap-1.5">
                        <Icon name="map-pin" className="size-3.5" />
                        {item.commune?.name ?? item.region?.name ?? "National"}
                      </span>
                      {item.eventDate && (
                        <span className="flex items-center gap-1.5 font-medium text-accent-700">
                          <Icon name="calendar" className="size-3.5" />
                          Le {formatDate(item.eventDate)}
                        </span>
                      )}
                    </p>
                  </div>
                  <Icon
                    name="arrow-right"
                    className="hidden size-4 shrink-0 self-center text-stone-400 transition group-hover:translate-x-0.5 group-hover:text-brand-700 sm:block"
                  />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
