import Link from "next/link";

const links = [
  { href: "/admin", label: "Tableau de bord" },
  { href: "/admin/idees", label: "Idées" },
  { href: "/admin/commentaires", label: "Commentaires" },
  { href: "/admin/participations", label: "Participations" },
  { href: "/admin/actualites", label: "Actualités" },
  { href: "/admin/geo", label: "Régions / communes" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-6xl gap-8 px-4 py-8">
      <aside className="w-56 shrink-0">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Administration
        </h2>
        <nav className="flex flex-col gap-1 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded px-3 py-2 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex-1">{children}</div>
    </div>
  );
}
