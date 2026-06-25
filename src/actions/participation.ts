"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { participationSchema } from "@/lib/validation";
import type { ActionState } from "@/actions/ideas";

export async function createParticipationRequest(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/participation/nouvelle");

  const parsed = participationSchema.safeParse({
    communeId: formData.get("communeId"),
    type: formData.get("type"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Données invalides." };
  }

  await prisma.participationRequest.create({
    data: { ...parsed.data, userId: session.user.id },
  });

  revalidatePath("/admin/participations");
  redirect("/participation/merci");
}

export async function updateParticipationStatus(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Action réservée aux administrateurs.");
  }

  const requestId = formData.get("requestId") as string;
  const status = formData.get("status") as "APPROVED" | "REJECTED";

  await prisma.participationRequest.update({
    where: { id: requestId },
    data: { status },
  });

  revalidatePath("/admin/participations");
}
