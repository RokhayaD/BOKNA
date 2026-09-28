import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[65vh] items-center justify-center py-16">
      <div className="max-w-md text-center">
        <p className="font-display text-7xl font-semibold tracking-tight text-brand-700">404</p>
        <h1 className="mt-4 text-2xl font-semibold sm:text-3xl">Page introuvable</h1>
        <p className="mt-3 leading-relaxed text-stone-600">
          La page que vous cherchez n&apos;existe pas ou a été déplacée.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn btn-primary">
            <Icon name="arrow-left" className="size-4" />
            Retour à l&apos;accueil
          </Link>
          <Link href="/idees" className="btn btn-secondary">
            Boîte à idées
          </Link>
        </div>
      </div>
    </div>
  );
}
