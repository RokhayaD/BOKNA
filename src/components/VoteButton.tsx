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
          ? "bg-emerald-700 text-white hover:bg-emerald-600"
          : "border border-emerald-700 text-emerald-700 hover:bg-emerald-50"
      }`}
    >
      {hasVoted ? "✓ Soutenu" : "Soutenir"} ({voteCount})
    </button>
  );
}
