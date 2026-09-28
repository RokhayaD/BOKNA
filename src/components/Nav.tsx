"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { signOut } from "next-auth/react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Avatar } from "@/components/ui/Avatar";

const navLinks: { href: string; label: string; icon: IconName }[] = [
  { href: "/", label: "Régions", icon: "map" },
  { href: "/idees", label: "Boîte à idées", icon: "lightbulb" },
  { href: "/actualites", label: "Lu xew tay", icon: "newspaper" },
];

type SessionUser = { name: string; role: "CITIZEN" | "ADMIN" } | null;

export function Nav({ user }: { user: SessionUser }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" || pathname.startsWith("/regions") || pathname.startsWith("/communes") : pathname.startsWith(href);

  const allLinks =
    user?.role === "ADMIN"
      ? [...navLinks, { href: "/admin", label: "Administration", icon: "settings" as IconName }]
      : navLinks;

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const close = () => setMobileOpen(false);

  return (
    <>
      <nav aria-label="Navigation principale" className="hidden flex-1 items-center gap-1 md:flex">
        {allLinks.map((link) => {
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={`relative inline-flex h-9 items-center rounded-lg px-3 text-sm font-medium transition ${
                active
                  ? "text-ink after:absolute after:inset-x-3 after:-bottom-[14px] after:h-0.5 after:rounded-full after:bg-accent-600"
                  : "text-stone-600 hover:bg-stone-900/5 hover:text-ink"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="ml-auto hidden items-center gap-2 md:flex">
        {user ? (
          <>
            <Link href="/idees/nouvelle" className="btn btn-accent btn-sm hidden lg:inline-flex">
              <Icon name="plus" className="size-4" />
              Proposer une idée
            </Link>
            <UserMenu user={user} />
          </>
        ) : (
          <>
            <Link href="/login" className="btn btn-ghost btn-sm">
              Connexion
            </Link>
            <Link href="/register" className="btn btn-primary btn-sm">
              Créer un compte
            </Link>
          </>
        )}
      </div>

      <button
        type="button"
        onClick={() => setMobileOpen((v) => !v)}
        aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={mobileOpen}
        aria-controls="mobile-menu"
        className="btn btn-ghost ml-auto size-10 p-0 md:hidden"
      >
        <Icon name={mobileOpen ? "x" : "menu"} className="size-5" />
      </button>

      {mobileOpen && (
        <div
          id="mobile-menu"
          className="absolute inset-x-0 top-full max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-stone-200 bg-paper shadow-pop md:hidden"
        >
          <div className="px-4 py-4 sm:px-6">
            <nav aria-label="Navigation mobile" className="flex flex-col gap-1">
              {allLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={close}
                    aria-current={active ? "page" : undefined}
                    className={`flex h-12 items-center gap-3 rounded-xl px-3 text-[15px] font-medium transition ${
                      active ? "bg-white text-ink shadow-card ring-1 ring-stone-200" : "text-stone-700 hover:bg-stone-900/5"
                    }`}
                  >
                    <Icon name={link.icon} className={`size-5 ${active ? "text-brand-700" : "text-stone-400"}`} />
                    {link.label}
                    <Icon name="chevron-right" className="ml-auto size-4 text-stone-400" />
                  </Link>
                );
              })}
            </nav>

            <div className="mt-4 border-t border-stone-200 pt-4">
              {user ? (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/profil"
                    onClick={close}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-stone-900/5"
                  >
                    <Avatar name={user.name} />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-ink">{user.name}</span>
                      <span className="block text-xs text-stone-500">Voir mon profil</span>
                    </span>
                  </Link>
                  <Link href="/idees/nouvelle" onClick={close} className="btn btn-accent btn-lg w-full">
                    <Icon name="plus" className="size-4" />
                    Proposer une idée
                  </Link>
                  <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="btn btn-secondary btn-lg w-full"
                  >
                    <Icon name="log-out" className="size-4" />
                    Déconnexion
                  </button>
                </div>
              ) : (
                <div className="grid gap-2 sm:grid-cols-2">
                  <Link href="/register" onClick={close} className="btn btn-primary btn-lg w-full">
                    Créer un compte
                  </Link>
                  <Link href="/login" onClick={close} className="btn btn-secondary btn-lg w-full">
                    Connexion
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function UserMenu({ user }: { user: NonNullable<SessionUser> }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const itemBase = "flex h-9 w-full items-center gap-2.5 rounded-lg px-2.5 text-sm font-medium transition";
  const itemClass = `${itemBase} text-stone-700 hover:bg-stone-100 hover:text-ink`;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex h-9 items-center gap-2 rounded-full py-1 pr-2.5 pl-1 text-sm font-medium text-ink transition hover:bg-stone-900/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
      >
        <Avatar name={user.name} size="sm" />
        <span className="max-w-[10rem] truncate">{user.name}</span>
        <Icon name="chevron-down" className={`size-4 text-stone-400 transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-60 origin-top-right rounded-xl bg-white p-1.5 shadow-pop ring-1 ring-stone-900/5"
        >
          <div className="px-2.5 pt-1.5 pb-2.5">
            <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
            <p className="text-xs text-stone-500">{user.role === "ADMIN" ? "Administrateur" : "Citoyen"}</p>
          </div>
          <div className="border-t border-stone-100 pt-1.5">
            <Link href="/profil" role="menuitem" onClick={() => setOpen(false)} className={itemClass}>
              <Icon name="user" className="size-4 text-stone-400" />
              Mon profil
            </Link>
            {user.role === "ADMIN" && (
              <Link href="/admin" role="menuitem" onClick={() => setOpen(false)} className={itemClass}>
                <Icon name="settings" className="size-4 text-stone-400" />
                Administration
              </Link>
            )}
          </div>
          <div className="mt-1.5 border-t border-stone-100 pt-1.5">
            <button
              type="button"
              role="menuitem"
              onClick={() => signOut({ callbackUrl: "/" })}
              className={`${itemBase} text-red-700 hover:bg-red-50`}
            >
              <Icon name="log-out" className="size-4" />
              Déconnexion
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
