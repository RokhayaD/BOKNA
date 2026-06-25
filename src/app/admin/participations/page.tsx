import { prisma } from "@/lib/prisma";
import { updateParticipationStatus } from "@/actions/participation";

const statusLabels: Record<string, string> = {
  PENDING: "En attente",
  APPROVED: "Approuvée",
  REJECTED: "Rejetée",
};

const typeLabels: Record<string, string> = {
  INITIATIVE: "Participation à une initiative",
  MAYOR_CANDIDACY: "Candidature maire (coalition Bokna)",
};

export default async function AdminParticipationsPage() {
  const requests = await prisma.participationRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true } }, commune: true },
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Demandes de participation</h1>
      <ul className="space-y-4">
        {requests.map((req) => (
          <li key={req.id} className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-semibold text-slate-900">{typeLabels[req.type]}</h2>
              <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                {statusLabels[req.status]}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              {req.commune.name} · {req.user.name} ({req.user.email})
            </p>
            <p className="mt-2 text-sm text-slate-700">{req.message}</p>

            {req.status === "PENDING" && (
              <form action={updateParticipationStatus} className="mt-3 flex gap-2">
                <input type="hidden" name="requestId" value={req.id} />
                <button
                  type="submit"
                  name="status"
                  value="APPROVED"
                  className="rounded bg-emerald-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-600"
                >
                  Approuver
                </button>
                <button
                  type="submit"
                  name="status"
                  value="REJECTED"
                  className="rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-500"
                >
                  Rejeter
                </button>
              </form>
            )}
          </li>
        ))}
        {requests.length === 0 && <p className="text-sm text-slate-500">Aucune demande.</p>}
      </ul>
    </div>
  );
}
