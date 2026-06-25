import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
      <p className="text-slate-600">
        {user.email} {user.commune && `· ${user.commune.name}`}
      </p>

      <section className="mt-8">
        <h2 className="mb-3 font-semibold text-slate-900">Mes idées</h2>
        <ul className="space-y-2">
          {user.ideas.map((idea) => (
            <li key={idea.id} className="flex items-center justify-between rounded border border-slate-200 bg-white p-3 text-sm">
              <Link href={`/idees/${idea.id}`} className="font-medium text-slate-900 hover:text-emerald-700">
                {idea.title}
              </Link>
              <span className="text-xs text-slate-500">{statusLabels[idea.status]}</span>
            </li>
          ))}
          {user.ideas.length === 0 && <p className="text-sm text-slate-500">Aucune idée soumise.</p>}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="mb-3 font-semibold text-slate-900">Mes demandes de participation</h2>
        <ul className="space-y-2">
          {user.participationRequests.map((req) => (
            <li key={req.id} className="flex items-center justify-between rounded border border-slate-200 bg-white p-3 text-sm">
              <span>{req.commune.name}</span>
              <span className="text-xs text-slate-500">{statusLabels[req.status]}</span>
            </li>
          ))}
          {user.participationRequests.length === 0 && (
            <p className="text-sm text-slate-500">Aucune demande envoyée.</p>
          )}
        </ul>
      </section>
    </div>
  );
}
