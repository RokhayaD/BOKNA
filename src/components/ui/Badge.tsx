const tones = {
  brand: "bg-brand-50 text-brand-800 ring-brand-700/15",
  accent: "bg-accent-50 text-accent-800 ring-accent-600/15",
  amber: "bg-amber-50 text-amber-800 ring-amber-600/20",
  red: "bg-red-50 text-red-700 ring-red-600/15",
  neutral: "bg-stone-100 text-stone-700 ring-stone-500/15",
} as const;

const dots = {
  brand: "bg-brand-600",
  accent: "bg-accent-600",
  amber: "bg-amber-500",
  red: "bg-red-500",
  neutral: "bg-stone-400",
} as const;

export type BadgeTone = keyof typeof tones;

export function Badge({
  children,
  tone = "brand",
  dot = false,
}: {
  children: React.ReactNode;
  tone?: BadgeTone;
  dot?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset ${tones[tone]}`}
    >
      {dot && <span aria-hidden className={`size-1.5 rounded-full ${dots[tone]}`} />}
      {children}
    </span>
  );
}
