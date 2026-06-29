import Link from "next/link";

export default function ParticipationThanksPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl">
        ✅
      </div>
      <h1 className="mt-6 text-2xl font-bold text-slate-900">Demande envoyée !</h1>
      <p className="mt-3 text-slate-600">
        Votre demande de participation a bien été transmise à l&apos;administration. Vous serez
        notifié de son traitement.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-full bg-emerald-700 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-700/20 transition hover:-translate-y-0.5 hover:bg-emerald-600"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
