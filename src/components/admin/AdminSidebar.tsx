"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/components/ui/Icon";

const links: { href: string; label: string; icon: IconName }[] = [
  { href: "/admin", label: "Tableau de bord", icon: "dashboard" },
  { href: "/admin/idees", label: "Idées", icon: "lightbulb" },
  { href: "/admin/commentaires", label: "Commentaires", icon: "message" },
  { href: "/admin/participations", label: "Participations", icon: "sprout" },
  { href: "/admin/actualites", label: "Actualités", icon: "newspaper" },
  { href: "/admin/geo", label: "Territoires", icon: "map" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <p className="mb-3 hidden px-3 text-xs font-semibold tracking-[0.14em] text-stone-500 uppercase lg:block">
        Administration
      </p>
      <nav
        aria-label="Administration"
        className="-mx-4 mb-8 flex gap-1 overflow-x-auto border-b border-stone-200 px-4 pb-3 sm:-mx-6 sm:px-6 lg:mx-0 lg:mb-0 lg:flex-col lg:overflow-visible lg:border-0 lg:px-0 lg:pb-0"
      >
        {links.map((link) => {
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={`flex h-10 shrink-0 items-center gap-3 rounded-lg px-3 text-sm font-medium whitespace-nowrap transition ${
                active
                  ? "bg-white text-ink shadow-card ring-1 ring-stone-200"
                  : "text-stone-600 hover:bg-stone-900/5 hover:text-ink"
              }`}
            >
              <Icon name={link.icon} className={`size-[18px] ${active ? "text-brand-700" : "text-stone-400"}`} />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
