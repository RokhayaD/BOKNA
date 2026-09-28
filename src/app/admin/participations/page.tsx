import { prisma } from "@/lib/prisma";
import { updateParticipationStatus } from "@/actions/participation";
import { AdminPageHeader } from "@/components/AdminPageHeader";
import { ModerationButtons } from "@/components/admin/ModerationButtons";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate, moderationStatus, participationTypes } from "@/lib/labels";

export default async function AdminParticipationsPage() {
  const requests = await prisma.participationRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true } }, commune: true },
  });

  return (
    <div>
      <AdminPageHeader
        title="Demandes de participation"
        description={`${requests.filter((r) => r.status === "PENDING").length} en attente, sur ${requests.length} au total.`}
      />
      {requests.length === 0 ? (
        <EmptyState icon="sprout" title="Aucune demande" />
      ) : (
        <ul className="space-y-4">
          {requests.map((req) => {
            const type = participationTypes[req.type];
            const fullName = [req.firstName, req.lastName].filter(Boolean).join(" ");
            return (
              <li key={req.id} className="card p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="icon-tile">
                      <Icon name={type.icon} className="size-5" />
                    </span>
                    <div className="min-w-0">
                      <h2 className="text-base font-semibold">{type.label}</h2>
                      <p className="text-xs text-stone-500">
                        {req.commune.name} · {formatDate(req.createdAt)}
                      </p>
                    </div>
                  </div>
                  <Badge tone={moderationStatus[req.status].tone} dot>
                    {moderationStatus[req.status].f}
                  </Badge>
                </div>

                <dl className="mt-5 grid gap-3 rounded-xl bg-paper p-4 text-sm ring-1 ring-stone-200/70 sm:grid-cols-2">
                  <div className="flex items-center gap-2 text-stone-700">
                    <Icon name="user" className="size-4 text-stone-400" />
                    <dt className="sr-only">Compte</dt>
                    <dd className="truncate">{req.user.name}</dd>
                  </div>
                  <div className="flex items-center gap-2 text-stone-700">
                    <Icon name="mail" className="size-4 text-stone-400" />
                    <dt className="sr-only">Email</dt>
                    <dd className="truncate">
                      <a href={`mailto:${req.user.email}`} className="hover:text-brand-700">
                        {req.user.email}
                      </a>
                    </dd>
                  </div>
                  {fullName && (
                    <div className="flex items-center gap-2 text-stone-700">
                      <Icon name="landmark" className="size-4 text-stone-400" />
                      <dt className="sr-only">Nom du candidat</dt>
                      <dd className="truncate">{fullName}</dd>
                    </div>
                  )}
                  {req.phone && (
                    <div className="flex items-center gap-2 text-stone-700">
                      <Icon name="phone" className="size-4 text-stone-400" />
                      <dt className="sr-only">Téléphone</dt>
                      <dd>
                        <a href={`tel:${req.phone}`} className="hover:text-brand-700">
                          {req.phone}
                        </a>
                      </dd>
                    </div>
                  )}
                </dl>

                <p className="mt-4 text-sm leading-relaxed whitespace-pre-wrap text-stone-700">{req.message}</p>

                {req.status === "PENDING" && (
                  <form action={updateParticipationStatus} className="mt-5 border-t border-stone-100 pt-5">
                    <input type="hidden" name="requestId" value={req.id} />
                    <ModerationButtons />
                  </form>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
