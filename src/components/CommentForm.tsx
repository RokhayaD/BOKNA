"use client";

import { useActionState } from "react";
import { addComment } from "@/actions/ideas";
import { Alert } from "@/components/ui/Alert";

export function CommentForm({ ideaId }: { ideaId: string }) {
  const [state, formAction, pending] = useActionState(addComment, {});

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="ideaId" value={ideaId} />
      {state?.error && <Alert tone="error">{state.error}</Alert>}
      <label htmlFor="comment-content" className="sr-only">
        Votre commentaire
      </label>
      <textarea
        id="comment-content"
        name="content"
        required
        minLength={2}
        rows={3}
        placeholder="Partagez votre avis sur cette idée..."
        className="input resize-y"
      />
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-stone-500">Restez courtois et constructif.</p>
        <button type="submit" disabled={pending} className="btn btn-primary btn-sm">
          {pending ? "Envoi..." : "Publier"}
        </button>
      </div>
    </form>
  );
}
