import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateCommune } from "@/actions/geo";
import { AdminPageHeader } from "@/components/AdminPageHeader";

export default async function EditCommunePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const commune = await prisma.commune.findUnique({
    where: { id },
    include: { department: { include: { region: true } } },
  });

  if (!commune) notFound();

  return (
    <div>
      <Link href="/admin/geo" className="mb-4 inline-block text-sm font-medium text-emerald-700 hover:underline">
        ← Régions / communes
      </Link>
      <AdminPageHeader
        title={commune.name}
        description={`${commune.department.name} · ${commune.department.region.name}`}
      />

      <div className="max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <form action={updateCommune} className="space-y-4">
          <input type="hidden" name="id" value={commune.id} />

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Population</label>
            <input
              type="number"
              name="population"
              defaultValue={commune.population ?? ""}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Présentation</label>
            <textarea
              name="description"
              defaultValue={commune.description ?? ""}
              rows={5}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="rounded-full bg-emerald-700 px-6 py-2.5 font-semibold text-white shadow-sm transition hover:bg-emerald-600"
          >
            Enregistrer
          </button>
        </form>
      </div>
    </div>
  );
}
