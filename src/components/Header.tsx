import Link from "next/link";
import { auth } from "@/lib/auth";
import { Nav } from "@/components/Nav";

export async function Header() {
  const session = await auth();
  const user = session?.user ? { name: session.user.name ?? "Mon compte", role: session.user.role } : null;

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-900/10 bg-emerald-800/95 text-white shadow-sm backdrop-blur">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <span className="rounded-lg bg-white px-2 py-1 text-emerald-800 shadow-sm">Bokna</span>
          <span className="hidden text-sm font-normal text-emerald-100 lg:inline">
            la plateforme citoyenne du Sénégal
          </span>
        </Link>

        <Nav user={user} />
      </div>
    </header>
  );
}
