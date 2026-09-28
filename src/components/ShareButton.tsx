"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";

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
    <button type="button" onClick={handleShare} className="btn btn-ghost">
      <Icon name={copied ? "check" : "share"} className={`size-4 ${copied ? "text-brand-700" : ""}`} />
      <span aria-live="polite">{copied ? "Lien copié" : "Partager"}</span>
    </button>
  );
}
