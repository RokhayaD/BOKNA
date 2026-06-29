import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/PageHero";
import { Badge } from "@/components/Badge";

const statusColors: Record<string, "amber" | "emerald" | "red"> = {
  PENDING: "amber",
  APPROVED: "emerald",
  REJECTED: "red",
};

const statusLabels: Record<string, string> = {
  PENDING: "En attente",
  APPROVED: "Approuvée",
  REJECTED: "Rejetée",
};

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

  return (
    <div>
      <PageHero
        eyebrow={user.role === "ADMIN" ? "Administrateur" : "Citoyen"}
        title={user.name}
        subtitle={`${user.email}${user.commune ? ` · ${user.commune.name}` : ""}`}
        breadcrumb={<span className="text-white">Mon profil</span>}
      />

      <div className="mx-auto max-w-3xl px-4 py-12">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-slate-900">Mes idées</h2>
          <ul className="space-y-3">
            {user.ideas.map((idea) => (
              <li
                key={idea.id}
                className="flex items-center justify-between rounded-xl border border-slate-100 p-3 text-sm transition hover:border-emerald-200 hover:bg-emerald-50/40"
              >
                <Link href={`/idees/${idea.id}`} className="font-semibold text-slate-900 hover:text-emerald-700">
                  {idea.title}
                </Link>
                <Badge color={statusColors[idea.status]}>{statusLabels[idea.status]}</Badge>
              </li>
            ))}
            {user.ideas.length === 0 && (
              <li className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
                Aucune idée soumise.
              </li>
            )}
          </ul>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-slate-900">Mes demandes de participation</h2>
          <ul className="space-y-3">
            {user.participationRequests.map((req) => (
              <li
                key={req.id}
                className="flex items-center justify-between rounded-xl border border-slate-100 p-3 text-sm"
              >
                <span className="font-medium text-slate-900">{req.commune.name}</span>
                <Badge color={statusColors[req.status]}>{statusLabels[req.status]}</Badge>
              </li>
            ))}
            {user.participationRequests.length === 0 && (
              <li className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
                Aucune demande envoyée.
              </li>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
