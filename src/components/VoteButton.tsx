"use client";

import { useTransition } from "react";
import { voteIdea } from "@/actions/ideas";
import { Icon } from "@/components/ui/Icon";

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
      type="button"
      onClick={() => startTransition(() => voteIdea(ideaId))}
      disabled={pending}
      aria-pressed={hasVoted}
      className={`btn ${hasVoted ? "btn-primary" : "btn-secondary"} pr-1.5`}
    >
      <Icon name={hasVoted ? "check" : "thumbs-up"} className="size-4" />
      {hasVoted ? "Vous soutenez" : "Soutenir"}
      <span
        className={`ml-1 rounded-md px-2 py-0.5 text-xs font-semibold tabular-nums ${
          hasVoted ? "bg-white/20 text-white" : "bg-stone-100 text-stone-700"
        }`}
      >
        {voteCount}
      </span>
    </button>
  );
}
