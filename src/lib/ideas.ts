import type { Prisma } from "@prisma/client";

// Idées affichées publiquement : validées par la modération et publiques.
export const publicIdeaWhere = { status: "APPROVED", visibility: "PUBLIC" } satisfies Prisma.IdeaWhereInput;

// Une idée privée ou non validée n'est visible que par son auteur et l'administration.
export function canViewIdea(
  idea: { status: string; visibility: string; authorId: string },
  user?: { id?: string; role?: string } | null
) {
  if (user?.role === "ADMIN" || (user?.id && user.id === idea.authorId)) return true;
  return idea.status === "APPROVED" && idea.visibility === "PUBLIC";
}
