"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ideaSchema, commentSchema } from "@/lib/validation";
import {
  ATTACHMENT_ACCEPTED_TYPES,
  ATTACHMENT_MAX_FILES,
  ATTACHMENT_MAX_TOTAL_BYTES,
} from "@/lib/attachments";

export type ActionState = { error?: string };

export async function createIdea(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/idees/nouvelle");

  const parsed = ideaSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    category: formData.get("category"),
    communeId: formData.get("communeId"),
    visibility: formData.get("visibility"),
    estimatedCost: formData.get("estimatedCost") ?? undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Données invalides." };
  }

  const files = formData
    .getAll("attachments")
    .filter((f): f is File => f instanceof File && f.size > 0);

  if (files.length > ATTACHMENT_MAX_FILES) {
    return { error: `Vous pouvez joindre au maximum ${ATTACHMENT_MAX_FILES} fichiers.` };
  }
  if (files.some((f) => !ATTACHMENT_ACCEPTED_TYPES.includes(f.type))) {
    return { error: "Seules les images (JPEG, PNG, WebP) et les documents PDF sont acceptés." };
  }
  if (files.reduce((sum, f) => sum + f.size, 0) > ATTACHMENT_MAX_TOTAL_BYTES) {
    return { error: "Les fichiers joints dépassent la taille maximale autorisée (4 Mo au total)." };
  }

  const attachments = await Promise.all(
    files.map(async (file) => ({
      name: file.name.slice(0, 200),
      mimeType: file.type,
      size: file.size,
      data: new Uint8Array(await file.arrayBuffer()),
    }))
  );

  const idea = await prisma.idea.create({
    data: {
      ...parsed.data,
      authorId: session.user.id,
      attachments: attachments.length ? { create: attachments } : undefined,
    },
  });

  revalidatePath("/idees");
  redirect(`/idees/${idea.id}`);
}

export async function voteIdea(ideaId: string) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // Seules les idées publiées et publiques peuvent être soutenues.
  const idea = await prisma.idea.findUnique({ where: { id: ideaId }, select: { visibility: true } });
  if (!idea || idea.visibility !== "PUBLIC") return;

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
