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
    <div className="mx-auto flex min-h-[70vh] max-w-4xl items-center px-4 py-12">
      <div className="grid w-full overflow-hidden rounded-3xl shadow-xl ring-1 ring-slate-900/5 lg:grid-cols-2">
        <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-brand-950 via-brand-800 to-brand-700 p-10 text-white lg:flex">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-16 -left-16 h-56 w-56 rounded-full bg-brand-400/20 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-16 right-0 h-64 w-64 rounded-full bg-accent-500/20 blur-3xl"
          />
          <div className="relative">
            <span className="rounded bg-white px-2 py-1 text-lg font-bold text-brand-800">
              Bokna
            </span>
          </div>
          <div className="relative">
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="mt-2 text-sm text-brand-100/80">{tagline}</p>
          </div>
        </div>

        <div className="bg-white p-8 sm:p-10">{children}</div>
      </div>
    </div>
  );
}
