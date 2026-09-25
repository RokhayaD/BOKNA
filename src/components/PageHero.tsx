import Image from "next/image";

export function PageHero({
  eyebrow,
  title,
  subtitle,
  breadcrumb,
  actions,
  backgroundImage,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  breadcrumb?: React.ReactNode;
  actions?: React.ReactNode;
  backgroundImage?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-800 to-brand-700 px-4 py-12 text-white sm:py-16">
      {backgroundImage && (
        <>
          <Image
            src={backgroundImage}
            alt=""
            fill
            priority
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-brand-950/90 via-brand-900/70 to-brand-800/60" />
        </>
      )}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 -left-20 h-64 w-64 rounded-full bg-brand-400/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 right-0 h-72 w-72 rounded-full bg-accent-500/20 blur-3xl"
      />

      <div className="relative mx-auto max-w-5xl">
        {breadcrumb && (
          <div className="mb-4 flex flex-wrap items-center gap-1 text-sm text-brand-200/80 [&_a]:hover:text-white">
            {breadcrumb}
          </div>
        )}

        {eyebrow && (
          <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-wider text-brand-200 uppercase ring-1 ring-white/20 ring-inset">
            {eyebrow}
          </span>
        )}

        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight drop-shadow-sm sm:text-4xl">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 max-w-2xl text-brand-50/90 drop-shadow-sm">{subtitle}</p>
            )}
          </div>
          {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
        </div>
      </div>
    </section>
  );
}
