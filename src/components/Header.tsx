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
    <header className="border-b border-emerald-900/10 bg-emerald-800 text-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <span className="rounded bg-white px-2 py-1 text-emerald-800">Bokna</span>
          <span className="hidden text-sm font-normal text-emerald-100 sm:inline">
            la plateforme citoyenne du Sénégal
          </span>
        </Link>

        <nav className="flex flex-wrap items-center gap-4 text-sm font-medium">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-emerald-200">
              {link.label}
            </Link>
          ))}
          {session?.user?.role === "ADMIN" && (
            <Link href="/admin" className="hover:text-emerald-200">
              Administration
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3 text-sm">
          {session?.user ? (
            <>
              <Link href="/profil" className="hover:text-emerald-200">
                {session.user.name}
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button className="rounded bg-emerald-700 px-3 py-1.5 hover:bg-emerald-600">
                  Déconnexion
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-emerald-200">
                Connexion
              </Link>
              <Link
                href="/register"
                className="rounded bg-white px-3 py-1.5 font-semibold text-emerald-800 hover:bg-emerald-100"
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
