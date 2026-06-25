"use client";

import { useActionState } from "react";
import { addComment } from "@/actions/ideas";

export function CommentForm({ ideaId }: { ideaId: string }) {
  const [state, formAction, pending] = useActionState(addComment, {});

  return (
    <form action={formAction} className="mt-4 space-y-2">
      <input type="hidden" name="ideaId" value={ideaId} />
      {state?.error && <p className="text-sm text-red-700">{state.error}</p>}
      <textarea
        name="content"
        required
        minLength={2}
        rows={2}
        placeholder="Ajouter un commentaire..."
        className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded bg-slate-800 px-4 py-1.5 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60"
      >
        {pending ? "Envoi..." : "Commenter"}
      </button>
    </form>
  );
}
