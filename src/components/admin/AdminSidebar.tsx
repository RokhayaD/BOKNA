"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Tableau de bord", icon: "📊" },
  { href: "/admin/idees", label: "Idées", icon: "💡" },
  { href: "/admin/commentaires", label: "Commentaires", icon: "💬" },
  { href: "/admin/participations", label: "Participations", icon: "🤝" },
  { href: "/admin/actualites", label: "Actualités", icon: "📰" },
  { href: "/admin/geo", label: "Régions / communes", icon: "🗺️" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 bg-emerald-950 text-emerald-50">
      <div className="flex h-full flex-col px-4 py-6">
        <Link href="/" className="mb-8 flex items-center gap-2 px-2">
          <span className="rounded-lg bg-white px-2 py-1 text-lg font-bold text-emerald-800">
            Bokna
          </span>
          <span className="text-xs font-semibold tracking-wider text-emerald-300 uppercase">
            Admin
          </span>
        </Link>

        <nav className="flex flex-1 flex-col gap-1 text-sm">
          {links.map((link) => {
            const isActive = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 font-medium transition ${
                  isActive
                    ? "bg-emerald-700 text-white shadow-sm"
                    : "text-emerald-200/80 hover:bg-emerald-900 hover:text-white"
                }`}
              >
                <span aria-hidden>{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/"
          className="mt-4 flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-emerald-300/70 transition hover:bg-emerald-900 hover:text-white"
        >
          <span aria-hidden>←</span> Retour au site
        </Link>
      </div>
    </aside>
  );
}
