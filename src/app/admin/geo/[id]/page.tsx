import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateCommune } from "@/actions/geo";

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
    <div className="max-w-lg">
      <h1 className="mb-1 text-2xl font-bold text-slate-900">{commune.name}</h1>
      <p className="mb-6 text-sm text-slate-500">
        {commune.department.name} · {commune.department.region.name}
      </p>

      <form action={updateCommune} className="space-y-4">
        <input type="hidden" name="id" value={commune.id} />

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Population</label>
          <input
            type="number"
            name="population"
            defaultValue={commune.population ?? ""}
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Présentation</label>
          <textarea
            name="description"
            defaultValue={commune.description ?? ""}
            rows={5}
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
          />
        </div>

        <button
          type="submit"
          className="rounded bg-emerald-700 px-4 py-2 font-semibold text-white hover:bg-emerald-600"
        >
          Enregistrer
        </button>
      </form>
    </div>
  );
}
