import { prisma } from "@/lib/prisma";
import { updateParticipationStatus } from "@/actions/participation";
import { AdminPageHeader } from "@/components/AdminPageHeader";
import { Badge } from "@/components/Badge";

const statusBadge: Record<string, { label: string; color: "amber" | "emerald" | "red" }> = {
  PENDING: { label: "En attente", color: "amber" },
  APPROVED: { label: "Approuvée", color: "emerald" },
  REJECTED: { label: "Rejetée", color: "red" },
};

const typeLabels: Record<string, string> = {
  INITIATIVE: "🤝 Participation à une initiative",
  MAYOR_CANDIDACY: "🏛️ Membre de l'équipe municipale",
};

export default async function AdminParticipationsPage() {
  const requests = await prisma.participationRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true } }, commune: true },
  });

  return (
    <div>
      <AdminPageHeader
        title="Demandes de participation"
        description={`${requests.filter((r) => r.status === "PENDING").length} demande(s) en attente.`}
      />
      <ul className="space-y-4">
        {requests.map((req) => (
          <li key={req.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-bold text-slate-900">{typeLabels[req.type]}</h2>
              <Badge color={statusBadge[req.status].color}>{statusBadge[req.status].label}</Badge>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              {req.commune.name} · {req.user.name} ({req.user.email})
            </p>
            {(req.firstName || req.lastName || req.phone) && (
              <p className="mt-1 text-sm text-slate-500">
                {[req.firstName, req.lastName].filter(Boolean).join(" ")}
                {req.phone && ` · ${req.phone}`}
              </p>
            )}
            <p className="mt-2 text-sm text-slate-700">{req.message}</p>

            {req.status === "PENDING" && (
              <form action={updateParticipationStatus} className="mt-4 flex gap-2 border-t border-slate-100 pt-4">
                <input type="hidden" name="requestId" value={req.id} />
                <button
                  type="submit"
                  name="status"
                  value="APPROVED"
                  className="rounded-full bg-emerald-700 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-emerald-600"
                >
                  Approuver
                </button>
                <button
                  type="submit"
                  name="status"
                  value="REJECTED"
                  className="rounded-full bg-red-600 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-red-500"
                >
                  Rejeter
                </button>
              </form>
            )}
          </li>
        ))}
        {requests.length === 0 && (
          <li className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
            Aucune demande.
          </li>
        )}
      </ul>
    </div>
  );
}
