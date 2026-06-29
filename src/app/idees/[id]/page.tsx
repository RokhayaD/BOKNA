import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { VoteButton } from "@/components/VoteButton";
import { CommentForm } from "@/components/CommentForm";
import { ShareButton } from "@/components/ShareButton";
import { PageHero } from "@/components/PageHero";
import { Badge } from "@/components/Badge";

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
    <div>
      <PageHero
        eyebrow={categoryLabels[idea.category]}
        title={idea.title}
        subtitle={`Proposée par ${idea.author.name} pour la commune de ${idea.commune.name}.`}
        breadcrumb={
          <>
            <Link href="/idees">Boîte à idées</Link>
            <span>/</span>
            <span className="text-white">{idea.title}</span>
          </>
        }
      />

      <div className="mx-auto max-w-3xl px-4 py-12">
        {idea.status === "PENDING" && (
          <p className="mb-6 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700 ring-1 ring-amber-200">
            ⏳ Cette idée est en attente de modération et n&apos;est visible que par vous et les
            administrateurs.
          </p>
        )}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="whitespace-pre-wrap leading-relaxed text-slate-700">{idea.description}</p>

          {idea.adminReply && (
            <div className="mt-4 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800 ring-1 ring-emerald-200">
              <p className="font-semibold">Réponse de l&apos;administration :</p>
              <p className="mt-1">{idea.adminReply}</p>
            </div>
          )}

          <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
            <VoteButton ideaId={idea.id} voteCount={idea.votes.length} hasVoted={hasVoted} />
            <ShareButton title={idea.title} />
          </div>
        </div>

        <section className="mt-8">
          <h2 className="mb-4 text-lg font-bold text-slate-900">
            Commentaires <Badge color="slate">{idea.comments.length}</Badge>
          </h2>
          <ul className="space-y-3">
            {idea.comments.map((comment) => (
              <li key={comment.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-sm text-slate-700">{comment.content}</p>
                <p className="mt-1.5 text-xs font-medium text-slate-500">{comment.author.name}</p>
              </li>
            ))}
            {idea.comments.length === 0 && (
              <li className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
                Aucun commentaire pour le moment.
              </li>
            )}
          </ul>

          {session?.user ? (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <CommentForm ideaId={idea.id} />
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-500">
              <Link href="/login" className="font-semibold text-emerald-700 hover:underline">
                Connectez-vous
              </Link>{" "}
              pour commenter.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
