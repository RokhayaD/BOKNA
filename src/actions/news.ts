"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { newsSchema } from "@/lib/validation";
import type { ActionState } from "@/actions/ideas";

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Action réservée aux administrateurs.");
  }
  return session!;
}

export async function createNews(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireAdmin();

  const raw = {
    title: formData.get("title"),
    content: formData.get("content"),
    type: formData.get("type"),
    communeId: formData.get("communeId") || undefined,
    regionId: formData.get("regionId") || undefined,
    eventDate: formData.get("eventDate") || undefined,
  };
  const parsed = newsSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Données invalides." };
  }

  await prisma.news.create({
    data: {
      title: parsed.data.title,
      content: parsed.data.content,
      type: parsed.data.type,
      communeId: parsed.data.communeId || null,
      regionId: parsed.data.regionId || null,
      eventDate: parsed.data.eventDate ? new Date(parsed.data.eventDate) : null,
      authorId: session.user.id,
    },
  });

  revalidatePath("/actualites");
  revalidatePath("/admin/actualites");
  redirect("/admin/actualites");
}

export async function deleteNews(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") as string;
  await prisma.news.delete({ where: { id } });
  revalidatePath("/actualites");
  revalidatePath("/admin/actualites");
}
