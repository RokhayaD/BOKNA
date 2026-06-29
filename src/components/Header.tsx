import Link from "next/link";
import { auth, signOut } from "@/lib/auth";

const navLinks = [
  { href: "/", label: "Régions" },
  { href: "/idees", label: "Boîte à idées" },
  { href: "/actualites", label: "Lu xew tay" },
];

export async function Header() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-900/10 bg-emerald-800/95 text-white shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <span className="rounded-lg bg-white px-2 py-1 text-emerald-800 shadow-sm">Bokna</span>
          <span className="hidden text-sm font-normal text-emerald-100 sm:inline">
            la plateforme citoyenne du Sénégal
          </span>
        </Link>

        <nav className="flex flex-wrap items-center gap-5 text-sm font-medium">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-emerald-200">
              {link.label}
            </Link>
          ))}
          {session?.user?.role === "ADMIN" && (
            <Link href="/admin" className="transition hover:text-emerald-200">
              Administration
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3 text-sm">
          {session?.user ? (
            <>
              <Link href="/profil" className="font-medium transition hover:text-emerald-200">
                {session.user.name}
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button className="rounded-full bg-emerald-700 px-4 py-1.5 font-medium transition hover:bg-emerald-600">
                  Déconnexion
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="transition hover:text-emerald-200">
                Connexion
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-white px-4 py-1.5 font-semibold text-emerald-800 shadow-sm transition hover:bg-emerald-100"
              >
                S&apos;inscrire
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
