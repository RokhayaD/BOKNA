import { Logo } from "@/components/ui/Logo";

export function AuthCard({
  title,
  tagline,
  children,
}: {
  title: string;
  tagline: string;
  children: React.ReactNode;
}) {
  return (
    <div className="container-page py-10 sm:py-16">
      <div className="card mx-auto grid max-w-5xl overflow-hidden lg:grid-cols-[1fr_1.15fr]">
        <div className="relative hidden min-h-[36rem] overflow-hidden bg-brand-900 lg:block">
          <svg
            aria-hidden
            className="absolute -right-40 -bottom-40 size-[34rem] text-white/[0.07]"
            viewBox="0 0 200 200"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.75"
          >
            <circle cx="100" cy="100" r="30" />
            <circle cx="100" cy="100" r="52" />
            <circle cx="100" cy="100" r="74" />
            <circle cx="100" cy="100" r="96" />
          </svg>
          <span aria-hidden className="absolute top-10 right-10 size-3 rounded-full bg-accent-500" />
          <div className="relative flex h-full flex-col justify-between p-10 text-white">
            <Logo tone="light" />
            <div>
              <p className="font-display text-3xl leading-tight font-semibold">{title}</p>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/80">{tagline}</p>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-10 lg:p-12">{children}</div>
      </div>
    </div>
  );
}
