import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateRegion } from "@/actions/geo";
import { AdminPageHeader } from "@/components/AdminPageHeader";

export default async function EditRegionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const region = await prisma.region.findUnique({ where: { id } });

  if (!region) notFound();

  return (
    <div>
      <AdminPageHeader
        title={`Région de ${region.name}`}
        description="Présentation affichée en tête de la page publique de la région."
        back={{ href: "/admin/geo", label: "Territoires" }}
        action={
          <Link href={`/regions/${region.slug}`} className="btn btn-secondary btn-sm">
            Voir la page publique
          </Link>
        }
      />

      <div className="card max-w-3xl p-6 sm:p-8">
        <form action={updateRegion} className="space-y-6">
          <input type="hidden" name="id" value={region.id} />

          <div>
            <label htmlFor="region-description" className="label">
              Présentation
            </label>
            <textarea
              id="region-description"
              name="description"
              defaultValue={region.description ?? ""}
              rows={5}
              maxLength={3000}
              className="input resize-y"
            />
            <p className="hint">Quelques phrases qui décrivent la région : situation, identité, économie.</p>
          </div>

          <div>
            <label htmlFor="region-highlights" className="label">
              Points clés
            </label>
            <textarea
              id="region-highlights"
              name="highlights"
              defaultValue={region.highlights.join("\n")}
              rows={4}
              className="input resize-y"
            />
            <p className="hint">Un point clé par ligne, 8 au maximum.</p>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <label htmlFor="region-capital" className="label">
                Chef-lieu
              </label>
              <input id="region-capital" name="capital" defaultValue={region.capital ?? ""} className="input" />
            </div>
            <div>
              <label htmlFor="region-area" className="label">
                Superficie <span className="font-normal text-stone-400">(km²)</span>
              </label>
              <input
                id="region-area"
                name="area"
                type="number"
                min={0}
                defaultValue={region.area ?? ""}
                className="input"
              />
            </div>
            <div>
              <label htmlFor="region-population" className="label">
                Population
              </label>
              <input
                id="region-population"
                name="population"
                type="number"
                min={0}
                defaultValue={region.population ?? ""}
                className="input"
              />
            </div>
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
