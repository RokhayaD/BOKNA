import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { VoteButton } from "@/components/VoteButton";
import { CommentForm } from "@/components/CommentForm";
import { ShareButton } from "@/components/ShareButton";

const categoryLabels: Record<string, string> = {
  AMELIORATION: "Amélioration",
  SIGNALEMENT: "Signalement",
  INVESTISSEMENT: "Investissement",
  PROJET_COMMUNAUTAIRE: "Projet communautaire",
};

export default async function IdeaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const idea = await prisma.idea.findUnique({
    where: { id },
    include: {
      commune: true,
      author: { select: { name: true } },
      votes: true,
      comments: {
        where: { status: "APPROVED" },
        orderBy: { createdAt: "asc" },
        include: { author: { select: { name: true } } },
      },
    },
  });

  if (!idea) notFound();
  if (idea.status !== "APPROVED" && session?.user?.role !== "ADMIN" && session?.user?.id !== idea.authorId) {
    notFound();
  }

  const hasVoted = session?.user ? idea.votes.some((v) => v.userId === session.user.id) : false;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <nav className="mb-4 text-sm text-slate-500">
        <Link href="/idees" className="hover:underline">
          Boîte à idées
        </Link>{" "}
        / <span className="text-slate-700">{idea.title}</span>
      </nav>

      {idea.status === "PENDING" && (
        <p className="mb-4 rounded bg-amber-50 px-3 py-2 text-sm text-amber-700">
          Cette idée est en attente de modération et n&apos;est visible que par vous et les administrateurs.
        </p>
      )}

      <h1 className="text-2xl font-bold text-slate-900">{idea.title}</h1>
      <p className="mt-1 text-sm text-slate-500">
        {categoryLabels[idea.category]} ·{" "}
        <Link href={`/communes/${idea.commune.slug}`} className="hover:underline">
          {idea.commune.name}
        </Link>{" "}
        · proposée par {idea.author.name}
      </p>

      <p className="mt-4 whitespace-pre-wrap text-slate-700">{idea.description}</p>

      {idea.adminReply && (
        <div className="mt-4 rounded bg-emerald-50 p-3 text-sm text-emerald-800">
          <p className="font-semibold">Réponse de l&apos;administration :</p>
          <p>{idea.adminReply}</p>
        </div>
      )}

      <div className="mt-6 flex items-center gap-3">
        <VoteButton ideaId={idea.id} voteCount={idea.votes.length} hasVoted={hasVoted} />
        <ShareButton title={idea.title} />
      </div>

      <section className="mt-10">
        <h2 className="mb-3 font-semibold text-slate-900">
          Commentaires ({idea.comments.length})
        </h2>
        <ul className="space-y-3">
          {idea.comments.map((comment) => (
            <li key={comment.id} className="rounded border border-slate-200 bg-white p-3">
              <p className="text-sm text-slate-700">{comment.content}</p>
              <p className="mt-1 text-xs text-slate-500">{comment.author.name}</p>
            </li>
          ))}
          {idea.comments.length === 0 && (
            <p className="text-sm text-slate-500">Aucun commentaire pour le moment.</p>
          )}
        </ul>

        {session?.user ? (
          <CommentForm ideaId={idea.id} />
        ) : (
          <p className="mt-4 text-sm text-slate-500">
            <Link href="/login" className="font-medium text-emerald-700 hover:underline">
              Connectez-vous
            </Link>{" "}
            pour commenter.
          </p>
        )}
      </section>
    </div>
  );
}
