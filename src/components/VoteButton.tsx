"use client";

import { useTransition } from "react";
import { voteIdea } from "@/actions/ideas";

export function VoteButton({
  ideaId,
  voteCount,
  hasVoted,
}: {
  ideaId: string;
  voteCount: number;
  hasVoted: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => voteIdea(ideaId))}
      disabled={pending}
      className={`rounded-full px-5 py-2 text-sm font-semibold shadow-sm transition disabled:opacity-60 ${
        hasVoted
          ? "bg-brand-700 text-white hover:bg-brand-600"
          : "border border-brand-700 text-brand-700 hover:bg-brand-50"
      }`}
    >
      {hasVoted ? "✓ Soutenu" : "Soutenir"} ({voteCount})
    </button>
  );
}
