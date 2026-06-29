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
        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-slate-800 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60"
      >
        {pending ? "Envoi..." : "Commenter"}
      </button>
    </form>
  );
}
