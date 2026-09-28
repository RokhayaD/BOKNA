import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

const columns = [
  {
    title: "Explorer",
    links: [
      { href: "/", label: "Régions du Sénégal" },
      { href: "/idees", label: "Boîte à idées" },
      { href: "/actualites", label: "Lu xew tay" },
    ],
  },
  {
    title: "Participer",
    links: [
      { href: "/idees/nouvelle", label: "Proposer une idée" },
      { href: "/participation/nouvelle", label: "Rejoindre une initiative" },
      { href: "/profil", label: "Mon espace citoyen" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-stone-200/80 bg-white">
      <div className="container-page grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr] lg:py-14">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-stone-600">
            La plateforme citoyenne qui rapproche les habitants de leur commune : découvrir son
            territoire, proposer des idées et s&apos;engager dans la vie municipale.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <p className="text-xs font-semibold tracking-[0.14em] text-stone-500 uppercase">{col.title}</p>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-stone-700 transition hover:text-brand-700">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-stone-100">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-stone-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Bokna — Plateforme citoyenne du Sénégal</p>
          <p className="font-medium text-stone-600">Ensemble, la bokk.</p>
        </div>
      </div>
    </footer>
  );
}
