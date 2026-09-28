"use client";

import { useState } from "react";

const format = (digits: string) => (digits ? BigInt(digits).toLocaleString("fr-FR") : "");

// Saisie monétaire en FCFA : chiffres uniquement, séparateurs de milliers affichés.
export function CostInput({ id, name }: { id: string; name: string }) {
  const [value, setValue] = useState("");

  return (
    <div className="relative max-w-sm">
      <input
        id={id}
        name={name}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        placeholder="0"
        value={value}
        onChange={(e) => setValue(format(e.target.value.replace(/\D/g, "").replace(/^0+(?=\d)/, "").slice(0, 15)))}
        className="input pr-20 text-right font-medium tabular-nums"
        aria-describedby={`${id}-hint`}
      />
      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center border-l border-stone-200 px-3.5 text-xs font-semibold text-stone-500">
        FCFA
      </span>
    </div>
  );
}
