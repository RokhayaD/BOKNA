import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { VoteButton } from "@/components/VoteButton";
import { CommentForm } from "@/components/CommentForm";
import { ShareButton } from "@/components/ShareButton";
import { PageHeader } from "@/components/PageHeader";
import { Alert } from "@/components/ui/Alert";
import { Avatar } from "@/components/ui/Avatar";
import { Icon } from "@/components/ui/Icon";
import { formatDate, formatFcfa, ideaCategories, ideaVisibility } from "@/lib/labels";
import { canViewIdea } from "@/lib/ideas";
import { AttachmentList } from "@/components/AttachmentList";

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
      attachments: { select: { id: true, name: true, mimeType: true, size: true }, orderBy: { createdAt: "asc" } },
      comments: {
        where: { status: "APPROVED" },
        orderBy: { createdAt: "asc" },
        include: { author: { select: { name: true } } },
      },
    },
  });

  if (!idea) notFound();
  if (!canViewIdea(idea, session?.user)) notFound();
  const isPrivate = idea.visibility === "PRIVATE";

  const hasVoted = session?.user ? idea.votes.some((v) => v.userId === session.user.id) : false;
  const category = ideaCategories[idea.category];

  return (
    <div>
      <PageHeader
        eyebrow={category.label}
        title={idea.title}
        breadcrumb={[{ label: "Boîte à idées", href: "/idees" }, { label: idea.title }]}
        meta={[
          { icon: "map-pin", label: idea.commune.name },
          { icon: "user", label: `Proposée par ${idea.author.name}` },
          { icon: "calendar", label: formatDate(idea.createdAt) },
        ]}
      />

      <div className="container-page grid grid-cols-1 gap-8 py-10 sm:py-12 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          {isPrivate && (
            <div className="flex gap-3 rounded-xl bg-stone-100 px-4 py-3 text-sm text-stone-700 ring-1 ring-stone-900/5 ring-inset">
              <Icon name="lock" className="mt-px size-[18px] shrink-0 text-stone-500" />
              <p className="leading-relaxed">
                Idée privée : elle est transmise uniquement à l&apos;administration et n&apos;apparaît pas
                dans la boîte à idées.
              </p>
            </div>
          )}

          {idea.status === "PENDING" && !isPrivate && (
            <Alert tone="warning">
              Cette idée est en attente de modération. Elle n&apos;est visible que par vous et les
              administrateurs.
            </Alert>
          )}

          <article className="card p-6 sm:p-8">
            <p className="text-[15px] leading-relaxed whitespace-pre-wrap text-stone-700">{idea.description}</p>

            {idea.attachments.length > 0 && (
              <div className="mt-8">
                <h2 className="mb-3 flex items-center gap-2 font-sans text-sm font-semibold text-ink">
                  <Icon name="paperclip" className="size-4 text-stone-400" />
                  Fichiers joints ({idea.attachments.length})
                </h2>
                <AttachmentList attachments={idea.attachments} />
              </div>
            )}

            {idea.adminReply && (
              <div className="mt-6 rounded-xl border-l-[3px] border-brand-700 bg-brand-50 px-5 py-4">
                <p className="flex items-center gap-2 text-sm font-semibold text-brand-900">
                  <Icon name="landmark" className="size-4" />
                  Réponse de l&apos;administration
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-brand-950/80">{idea.adminReply}</p>
              </div>
            )}

            {!isPrivate && (
              <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-stone-100 pt-6">
                <VoteButton ideaId={idea.id} voteCount={idea.votes.length} hasVoted={hasVoted} />
                <ShareButton title={idea.title} />
              </div>
            )}
          </article>

          <section aria-labelledby="comments-title">
            <h2 id="comments-title" className="flex items-center gap-2.5 text-xl font-semibold">
              Commentaires
              <span className="rounded-full bg-stone-200/70 px-2 py-0.5 font-sans text-xs font-semibold text-stone-600">
                {idea.comments.length}
              </span>
            </h2>

            {idea.comments.length === 0 ? (
              <p className="mt-4 text-sm text-stone-500">Aucun commentaire pour le moment. Lancez la discussion.</p>
            ) : (
              <ul className="mt-5 space-y-3">
                {idea.comments.map((comment) => (
                  <li key={comment.id} className="card flex gap-3 p-4 sm:p-5">
                    <Avatar name={comment.author.name} />
                    <div className="min-w-0">
                      <p className="text-sm">
                        <span className="font-semibold text-ink">{comment.author.name}</span>
                        <span className="text-stone-400"> · {formatDate(comment.createdAt, { day: "numeric", month: "short" })}</span>
                      </p>
                      <p className="mt-1 text-sm leading-relaxed whitespace-pre-wrap text-stone-700">{comment.content}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-5">
              {session?.user ? (
                <div className="card p-4 sm:p-5">
                  <CommentForm ideaId={idea.id} />
                </div>
              ) : (
                <div className="flex flex-col items-start gap-3 rounded-2xl border border-dashed border-stone-300 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-stone-600">Connectez-vous pour participer à la discussion.</p>
                  <Link href={`/login?callbackUrl=/idees/${idea.id}`} className="btn btn-secondary btn-sm">
                    Se connecter
                  </Link>
                </div>
              )}
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="card p-6">
            {!isPrivate && (
              <div className="mb-6 border-b border-stone-100 pb-5">
                <p className="font-display text-4xl font-semibold tracking-tight text-ink">{idea.votes.length}</p>
                <p className="text-sm text-stone-500">
                  {idea.votes.length === 0
                    ? "Soyez le premier à soutenir cette idée"
                    : `${idea.votes.length > 1 ? "citoyens soutiennent" : "citoyen soutient"} cette idée`}
                </p>
              </div>
            )}
            {idea.estimatedCost !== null && (
              <div className="mb-5 rounded-xl bg-paper p-4 ring-1 ring-stone-200/70">
                <p className="flex items-center gap-1.5 text-xs font-medium text-stone-500">
                  <Icon name="banknote" className="size-3.5" />
                  Coût estimatif
                </p>
                <p className="mt-1 font-display text-xl font-semibold text-ink tabular-nums">
                  {formatFcfa(idea.estimatedCost)}
                </p>
              </div>
            )}
            <dl className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-stone-500">Catégorie</dt>
                <dd className="flex items-center gap-1.5 font-medium text-ink">
                  <Icon name={category.icon} className="size-4 text-brand-700" />
                  {category.label}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-stone-500">Commune</dt>
                <dd className="font-medium text-ink">{idea.commune.name}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-stone-500">Visibilité</dt>
                <dd className="flex items-center gap-1.5 font-medium text-ink">
                  <Icon name={ideaVisibility[idea.visibility].icon} className="size-4 text-brand-700" />
                  {ideaVisibility[idea.visibility].label}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-stone-500">Commentaires</dt>
                <dd className="font-medium text-ink">{idea.comments.length}</dd>
              </div>
            </dl>
            <Link href={`/communes/${idea.commune.slug}`} className="btn btn-secondary mt-6 w-full">
              Voir la commune
              <Icon name="arrow-right" className="size-4" />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
