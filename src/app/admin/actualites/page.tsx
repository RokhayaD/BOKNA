import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteNews } from "@/actions/news";
import { AdminPageHeader } from "@/components/AdminPageHeader";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate, newsTypes } from "@/lib/labels";

export default async function AdminNewsPage() {
  const news = await prisma.news.findMany({
    orderBy: { publishedAt: "desc" },
    include: { commune: true, region: true },
  });

  const publishButton = (
    <Link href="/admin/actualites/nouvelle" className="btn btn-primary">
      <Icon name="plus" className="size-4" />
      Publier une actualité
    </Link>
  );

  return (
    <div>
      <AdminPageHeader
        title="Actualités — Lu xew tay"
        description={`${news.length} publication${news.length > 1 ? "s" : ""}.`}
        action={publishButton}
      />

      {news.length === 0 ? (
        <EmptyState icon="newspaper" title="Aucune actualité publiée" action={publishButton} />
      ) : (
        <ul className="card divide-y divide-stone-100 overflow-hidden">
          {news.map((item) => (
            <li key={item.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <Badge tone={newsTypes[item.type].tone} dot>
                  {newsTypes[item.type].label}
                </Badge>
                <Link
                  href={`/actualites/${item.id}`}
                  className="mt-2 block truncate font-semibold text-ink hover:text-brand-700"
                >
                  {item.title}
                </Link>
                <p className="mt-0.5 text-xs text-stone-500">
                  {item.commune?.name ?? item.region?.name ?? "National"} · {formatDate(item.publishedAt)}
                </p>
              </div>
              <form action={deleteNews} className="shrink-0">
                <input type="hidden" name="id" value={item.id} />
                <button type="submit" className="btn btn-danger btn-sm">
                  <Icon name="trash" className="size-4" />
                  Supprimer
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
