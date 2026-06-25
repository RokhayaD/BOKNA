"use client";

import { useState } from "react";

export function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // l'utilisateur a annulé le partage natif, on bascule sur la copie du lien
      }
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleShare}
      className="rounded border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
    >
      {copied ? "Lien copié !" : "Partager"}
    </button>
  );
}
