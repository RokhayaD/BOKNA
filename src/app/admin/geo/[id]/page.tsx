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
      <AdminPageHeader
        title={commune.name}
        description={`${commune.department.name} · ${commune.department.region.name}`}
        back={{ href: "/admin/geo", label: "Territoires" }}
        action={
          <Link href={`/communes/${commune.slug}`} className="btn btn-secondary btn-sm">
            Voir la page publique
          </Link>
        }
      />

      <div className="card max-w-2xl p-6 sm:p-8">
        <form action={updateCommune} className="space-y-6">
          <input type="hidden" name="id" value={commune.id} />

          <div>
            <label htmlFor="commune-population" className="label">
              Population
            </label>
            <input
              id="commune-population"
              type="number"
              name="population"
              min={0}
              defaultValue={commune.population ?? ""}
              className="input max-w-xs"
            />
          </div>

          <div>
            <label htmlFor="commune-description" className="label">
              Présentation
            </label>
            <textarea
              id="commune-description"
              name="description"
              defaultValue={commune.description ?? ""}
              rows={6}
              className="input resize-y"
            />
            <p className="hint">Affichée dans la section « Présentation » de la page de la commune.</p>
          </div>

          <div className="flex gap-3 border-t border-stone-100 pt-6">
            <button type="submit" className="btn btn-primary">
              Enregistrer
            </button>
            <Link href="/admin/geo" className="btn btn-secondary">
              Annuler
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
