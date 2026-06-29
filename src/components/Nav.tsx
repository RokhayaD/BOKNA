"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "next-auth/react";

const navLinks = [
  { href: "/", label: "Régions", icon: "🗺️" },
  { href: "/idees", label: "Boîte à idées", icon: "💡" },
  { href: "/actualites", label: "Lu xew tay", icon: "📰" },
];

type SessionUser = { name: string; role: "CITIZEN" | "ADMIN" } | null;

export function Nav({ user }: { user: SessionUser }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const initial = user?.name?.trim()?.[0]?.toUpperCase() ?? "?";

  const allLinks = user?.role === "ADMIN" ? [...navLinks, { href: "/admin", label: "Administration", icon: "⚙️" }] : navLinks;

  return (
    <>
      <nav className="hidden items-center gap-1 text-sm font-medium md:flex">
        {allLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 transition ${
              isActive(link.href)
                ? "bg-white/15 text-white shadow-sm"
                : "text-emerald-100/85 hover:bg-white/10 hover:text-white"
            }`}
          >
            <span aria-hidden className="text-xs">
              {link.icon}
            </span>
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="hidden items-center gap-3 md:flex">
        {user ? (
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen((v) => !v)}
              onBlur={() => setTimeout(() => setUserMenuOpen(false), 150)}
              className="flex items-center gap-2 rounded-full bg-white/10 px-2 py-1 pr-3 text-sm font-medium text-white transition hover:bg-white/20"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm font-bold text-emerald-800">
                {initial}
              </span>
              {user.name}
              <span aria-hidden className="text-xs text-emerald-200">
                ▾
              </span>
            </button>
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-2xl bg-white py-1.5 text-sm font-medium text-slate-700 shadow-xl ring-1 ring-slate-900/5">
                <Link href="/profil" className="block px-4 py-2 transition hover:bg-emerald-50 hover:text-emerald-700">
                  👤 Mon profil
                </Link>
                {user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="block px-4 py-2 transition hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    ⚙️ Administration
                  </Link>
                )}
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="block w-full px-4 py-2 text-left text-red-600 transition hover:bg-red-50"
                >
                  ↪ Déconnexion
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link href="/login" className="text-sm font-medium text-emerald-100 transition hover:text-white">
              Connexion
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-emerald-800 shadow-sm transition hover:bg-emerald-100"
            >
              S&apos;inscrire
            </Link>
          </>
        )}
      </div>

      <button
        onClick={() => setMobileOpen((v) => !v)}
        aria-label="Ouvrir le menu"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white md:hidden"
      >
        <span aria-hidden className="text-lg">
          {mobileOpen ? "✕" : "☰"}
        </span>
      </button>

      {mobileOpen && (
        <div className="absolute inset-x-0 top-full border-t border-emerald-900/20 bg-emerald-800 px-4 py-4 shadow-lg md:hidden">
          <nav className="flex flex-col gap-1 text-sm font-medium">
            {allLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 rounded-xl px-3 py-2.5 transition ${
                  isActive(link.href) ? "bg-white/15 text-white" : "text-emerald-100/85 hover:bg-white/10"
                }`}
              >
                <span aria-hidden>{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 flex flex-col gap-2 border-t border-emerald-900/20 pt-3">
            {user ? (
              <>
                <Link
                  href="/profil"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-3 py-2.5 text-sm font-medium text-emerald-100/85 hover:bg-white/10"
                >
                  👤 {user.name}
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="rounded-full bg-emerald-700 px-4 py-2 text-center text-sm font-semibold text-white"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-3 py-2.5 text-sm font-medium text-emerald-100/85 hover:bg-white/10"
                >
                  Connexion
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-full bg-white px-4 py-2 text-center text-sm font-semibold text-emerald-800"
                >
                  S&apos;inscrire
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
