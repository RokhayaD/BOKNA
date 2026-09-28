"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { regionSchema } from "@/lib/validation";

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Action réservée aux administrateurs.");
  }
}

// Champ numérique facultatif : vide (ou invalide) => non renseigné.
function optionalInt(value: FormDataEntryValue | null | undefined) {
  const digits = String(value ?? "").replace(/\D/g, "");
  if (!digits) return null;
  const n = Number(digits);
  return Number.isSafeInteger(n) && n <= 2_147_483_647 ? n : null;
}

export async function updateCommune(formData: FormData) {
  await requireAdmin();

  const id = formData.get("id") as string;
  const description = formData.get("description") as string;

  const commune = await prisma.commune.update({
    where: { id },
    data: {
      population: optionalInt(formData.get("population")),
      description,
    },
  });

  revalidatePath("/admin/geo");
  revalidatePath(`/admin/geo/${id}`);
  revalidatePath(`/communes/${commune.slug}`);
  redirect("/admin/geo");
}

export async function updateRegion(formData: FormData) {
  await requireAdmin();

  const parsed = regionSchema.safeParse({
    id: formData.get("id"),
    capital: formData.get("capital") ?? undefined,
    description: formData.get("description") ?? undefined,
    highlights: formData.get("highlights") ?? undefined,
    area: formData.get("area") ?? undefined,
    population: formData.get("population") ?? undefined,
  });
  if (!parsed.success) throw new Error("Données invalides.");
  const data = parsed.data;

  const region = await prisma.region.update({
    where: { id: data.id },
    data: {
      capital: data.capital || null,
      description: data.description || null,
      // Un point clé par ligne
      highlights: (data.highlights ?? "")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .slice(0, 8),
      area: optionalInt(data.area),
      population: optionalInt(data.population),
    },
  });

  revalidatePath("/admin/geo");
  revalidatePath(`/regions/${region.slug}`);
  redirect("/admin/geo");
}
