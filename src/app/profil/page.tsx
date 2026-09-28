import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Icon } from "@/components/ui/Icon";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate, moderationStatus, participationTypes } from "@/lib/labels";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/profil");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      commune: true,
      ideas: { orderBy: { createdAt: "desc" }, include: { commune: true } },
      participationRequests: { orderBy: { createdAt: "desc" }, include: { commune: true } },
    },
  });

  if (!user) redirect("/login");

  const approvedIdeas = user.ideas.filter((i) => i.status === "APPROVED").length;

  return (
    <div>
      <PageHeader
        eyebrow="Mon espace citoyen"
        title={`Bonjour, ${user.name}`}
        subtitle="Suivez vos idées et vos demandes de participation."
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Mon profil" }]}
        actions={
          <Link href="/idees/nouvelle" className="btn btn-accent btn-lg">
            <Icon name="plus" className="size-4" />
            Proposer une idée
          </Link>
        }
      />

      <div className="container-page grid grid-cols-1 gap-8 py-10 sm:py-12 lg:grid-cols-3">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="card p-6">
            <div className="flex items-center gap-4">
              <Avatar name={user.name} size="lg" />
              <div className="min-w-0">
                <p className="truncate font-display text-lg font-semibold text-ink">{user.name}</p>
                <Badge tone={user.role === "ADMIN" ? "accent" : "brand"}>
                  {user.role === "ADMIN" ? "Administrateur" : "Citoyen"}
                </Badge>
              </div>
            </div>
            <dl className="mt-6 space-y-3 border-t border-stone-100 pt-5 text-sm">
              <div className="flex items-center gap-2.5 text-stone-600">
                <Icon name="mail" className="size-4 text-stone-400" />
                <dt className="sr-only">Email</dt>
                <dd className="truncate">{user.email}</dd>
              </div>
              {user.commune && (
                <div className="flex items-center gap-2.5 text-stone-600">
                  <Icon name="map-pin" className="size-4 text-stone-400" />
                  <dt className="sr-only">Commune</dt>
                  <dd>
                    <Link href={`/communes/${user.commune.slug}`} className="hover:text-brand-700">
                      {user.commune.name}
                    </Link>
                  </dd>
                </div>
              )}
            </dl>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-paper p-3 ring-1 ring-stone-200/70">
                <p className="font-display text-2xl font-semibold text-ink">{user.ideas.length}</p>
                <p className="text-xs text-stone-500">Idées soumises</p>
              </div>
              <div className="rounded-xl bg-paper p-3 ring-1 ring-stone-200/70">
                <p className="font-display text-2xl font-semibold text-ink">{approvedIdeas}</p>
                <p className="text-xs text-stone-500">Idées publiées</p>
              </div>
            </div>
          </div>
        </aside>

        <div className="space-y-10 lg:col-span-2">
          <section>
            <h2 className="text-xl font-semibold">Mes idées</h2>
            <div className="mt-4">
              {user.ideas.length === 0 ? (
                <EmptyState
                  icon="lightbulb"
                  title="Vous n'avez pas encore proposé d'idée"
                  action={
                    <Link href="/idees/nouvelle" className="btn btn-primary btn-sm">
                      Proposer une idée
                    </Link>
                  }
                >
                  Partagez une amélioration, un signalement ou un projet pour votre commune.
                </EmptyState>
              ) : (
                <ul className="card divide-y divide-stone-100 overflow-hidden">
                  {user.ideas.map((idea) => (
                    <li key={idea.id}>
                      <Link
                        href={`/idees/${idea.id}`}
                        className="group flex items-center gap-4 px-5 py-4 transition hover:bg-stone-50"
                      >
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-medium text-ink group-hover:text-brand-700">
                            {idea.title}
                          </span>
                          <span className="mt-0.5 flex items-center gap-1.5 text-xs text-stone-500">
                            {idea.visibility === "PRIVATE" && (
                              <span className="flex items-center gap-1 font-medium text-stone-600">
                                <Icon name="lock" className="size-3" />
                                Privée ·
                              </span>
                            )}
                            {idea.commune.name} · {formatDate(idea.createdAt)}
                          </span>
                        </span>
                        <Badge tone={moderationStatus[idea.status].tone} dot>
                          {moderationStatus[idea.status].f}
                        </Badge>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Mes demandes de participation</h2>
            <div className="mt-4">
              {user.participationRequests.length === 0 ? (
                <EmptyState
                  icon="sprout"
                  title="Aucune demande envoyée"
                  action={
                    <Link href="/participation/nouvelle" className="btn btn-secondary btn-sm">
                      Participer à la vie municipale
                    </Link>
                  }
                >
                  Rejoignez une initiative ou l&apos;équipe municipale de votre commune.
                </EmptyState>
              ) : (
                <ul className="card divide-y divide-stone-100 overflow-hidden">
                  {user.participationRequests.map((req) => (
                    <li key={req.id} className="flex items-center gap-4 px-5 py-4">
                      <span className="icon-tile size-9">
                        <Icon name={participationTypes[req.type].icon} className="size-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-ink">
                          {participationTypes[req.type].label}
                        </span>
                        <span className="mt-0.5 block text-xs text-stone-500">
                          {req.commune.name} · {formatDate(req.createdAt)}
                        </span>
                      </span>
                      <Badge tone={moderationStatus[req.status].tone} dot>
                        {moderationStatus[req.status].f}
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
