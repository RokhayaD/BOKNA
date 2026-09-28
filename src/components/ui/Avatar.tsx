export function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const initial = name.trim()[0]?.toUpperCase() ?? "?";
  const sizes = {
    sm: "size-6 text-[11px]",
    md: "size-8 text-sm",
    lg: "size-16 text-2xl",
  };
  return (
    <span
      aria-hidden
      className={`flex shrink-0 items-center justify-center rounded-full bg-brand-100 font-display font-semibold text-brand-800 ring-1 ring-brand-700/10 ${sizes[size]}`}
    >
      {initial}
    </span>
  );
}
