"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ideaSchema, commentSchema } from "@/lib/validation";

export type ActionState = { error?: string };

export async function createIdea(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/idees/nouvelle");

  const parsed = ideaSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    category: formData.get("category"),
    communeId: formData.get("communeId"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Données invalides." };
  }

  const idea = await prisma.idea.create({
    data: { ...parsed.data, authorId: session.user.id },
  });

  revalidatePath("/idees");
  redirect(`/idees/${idea.id}`);
}

export async function voteIdea(ideaId: string) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const existing = await prisma.ideaVote.findUnique({
    where: { ideaId_userId: { ideaId, userId: session.user.id } },
  });

  if (existing) {
    await prisma.ideaVote.delete({ where: { id: existing.id } });
  } else {
    await prisma.ideaVote.create({ data: { ideaId, userId: session.user.id } });
  }

  revalidatePath(`/idees/${ideaId}`);
  revalidatePath("/idees");
}

export async function addComment(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const parsed = commentSchema.safeParse({
    ideaId: formData.get("ideaId"),
    content: formData.get("content"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Données invalides." };
  }

  await prisma.comment.create({
    data: {
      ideaId: parsed.data.ideaId,
      content: parsed.data.content,
      authorId: session.user.id,
    },
  });

  revalidatePath(`/idees/${parsed.data.ideaId}`);
  return {};
}

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Action réservée aux administrateurs.");
  }
}

export async function moderateIdea(formData: FormData) {
  await requireAdmin();

  const ideaId = formData.get("ideaId") as string;
  const status = formData.get("status") as "APPROVED" | "REJECTED";
  const adminReply = (formData.get("adminReply") as string) || null;

  await prisma.idea.update({
    where: { id: ideaId },
    data: { status, adminReply },
  });

  revalidatePath("/admin/idees");
  revalidatePath(`/idees/${ideaId}`);
  revalidatePath("/idees");
}

export async function moderateComment(formData: FormData) {
  await requireAdmin();

  const commentId = formData.get("commentId") as string;
  const status = formData.get("status") as "APPROVED" | "REJECTED";
  const ideaId = formData.get("ideaId") as string;

  await prisma.comment.update({ where: { id: commentId }, data: { status } });

  revalidatePath("/admin/commentaires");
  revalidatePath(`/idees/${ideaId}`);
}
