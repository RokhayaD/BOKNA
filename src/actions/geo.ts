"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function updateCommune(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Action réservée aux administrateurs.");
  }

  const id = formData.get("id") as string;
  const population = Number(formData.get("population"));
  const description = formData.get("description") as string;

  await prisma.commune.update({
    where: { id },
    data: {
      population: Number.isFinite(population) ? population : null,
      description,
    },
  });

  revalidatePath("/admin/geo");
  revalidatePath(`/admin/geo/${id}`);
  redirect("/admin/geo");
}
