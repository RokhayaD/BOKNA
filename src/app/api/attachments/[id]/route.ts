import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canViewIdea } from "@/lib/ideas";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const attachment = await prisma.ideaAttachment.findUnique({
    where: { id },
    include: { idea: { select: { status: true, visibility: true, authorId: true } } },
  });
  if (!attachment) return new Response("Fichier introuvable.", { status: 404 });

  const session = await auth();
  if (!canViewIdea(attachment.idea, session?.user)) {
    return new Response("Fichier introuvable.", { status: 404 });
  }

  const isPublic = attachment.idea.status === "APPROVED" && attachment.idea.visibility === "PUBLIC";

  return new Response(attachment.data, {
    headers: {
      "Content-Type": attachment.mimeType,
      "Content-Length": String(attachment.size),
      "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(attachment.name)}`,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": isPublic ? "public, max-age=3600" : "private, no-store",
    },
  });
}
