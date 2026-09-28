import Link from "next/link";
import { auth } from "@/lib/auth";
import { Nav } from "@/components/Nav";
import { Logo } from "@/components/ui/Logo";

export async function Header() {
  const session = await auth();
  const user = session?.user ? { name: session.user.name ?? "Mon compte", role: session.user.role } : null;

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/70 bg-paper/85 backdrop-blur-md">
      <div className="container-page relative flex h-16 items-center gap-6">
        <Link href="/" aria-label="Bokna — accueil" className="shrink-0 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600">
          <Logo />
        </Link>
        <Nav user={user} />
      </div>
    </header>
  );
}
