export function LogoMark({ className = "size-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <rect width="32" height="32" rx="9" fill="#338345" />
      <path d="M11 8v16" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      <circle cx="16.5" cy="18.5" r="5.5" fill="none" stroke="#fff" strokeWidth="3" />
      <circle cx="23.5" cy="8.75" r="2.5" fill="#dd431f" />
    </svg>
  );
}

export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark />
      <span
        className={`font-display text-xl font-semibold tracking-tight ${
          tone === "dark" ? "text-ink" : "text-white"
        }`}
      >
        Bokna
      </span>
    </span>
  );
}
