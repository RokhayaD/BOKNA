import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

export default function ParticipationThanksPage() {
  return (
    <div className="container-page flex min-h-[65vh] items-center justify-center py-16">
      <div className="card w-full max-w-lg p-8 text-center sm:p-10">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-brand-50 text-brand-700 ring-8 ring-brand-50/50">
          <Icon name="check-circle" className="size-7" />
        </span>
        <h1 className="mt-6 text-2xl font-semibold sm:text-3xl">Demande envoyée</h1>
        <p className="mt-3 leading-relaxed text-stone-600">
          Votre demande de participation a bien été transmise à l&apos;administration. Vous pourrez
          suivre son traitement depuis votre espace citoyen.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/profil" className="btn btn-primary">
            Suivre ma demande
          </Link>
          <Link href="/" className="btn btn-secondary">
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
