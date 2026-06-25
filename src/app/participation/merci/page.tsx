import Link from "next/link";

export default function ParticipationThanksPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <h1 className="text-2xl font-bold text-slate-900">Demande envoyée !</h1>
      <p className="mt-3 text-slate-600">
        Votre demande de participation a bien été transmise à l&apos;administration. Vous serez
        notifié de son traitement.
      </p>
      <Link href="/" className="mt-6 inline-block font-medium text-emerald-700 hover:underline">
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
