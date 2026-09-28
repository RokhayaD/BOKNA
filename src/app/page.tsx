import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { publicIdeaWhere } from "@/lib/ideas";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { formatDate, ideaCategories, newsTypes, plural } from "@/lib/labels";

const steps: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "compass",
    title: "Découvrez votre commune",
    text: "Parcourez les régions, départements et communes : présentation, projets en cours et actualité locale.",
  },
  {
    icon: "lightbulb",
    title: "Proposez et soutenez",
    text: "Soumettez une idée, signalez un problème ou soutenez les propositions de vos voisins.",
  },
  {
    icon: "landmark",
    title: "Engagez-vous",
    text: "Rejoignez une initiative citoyenne ou candidatez pour intégrer l'équipe municipale.",
  },
];

const regionImage = (slug: string) => `/regions/${slug.toUpperCase()}.jpeg`;

export default async function HomePage() {
  const [regions, communeCount, citizenCount, ideaCount, latestIdea, latestNews] = await Promise.all([
    prisma.region.findMany({
      orderBy: { name: "asc" },
      include: {
        departments: { select: { _count: { select: { communes: true } } } },
      },
    }),
    prisma.commune.count(),
    prisma.user.count(),
    prisma.idea.count({ where: publicIdeaWhere }),
    prisma.idea.findFirst({
      where: publicIdeaWhere,
      orderBy: { createdAt: "desc" },
      include: { commune: true, author: { select: { name: true } }, _count: { select: { votes: true, comments: true } } },
    }),
    prisma.news.findFirst({ orderBy: { publishedAt: "desc" }, include: { commune: true, region: true } }),
  ]);

  const stats = [
    { value: regions.length, label: "Régions" },
    { value: communeCount, label: "Communes" },
    { value: citizenCount, label: "Citoyens inscrits" },
    { value: ideaCount, label: "Idées publiées" },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-stone-200/70">
        <div className="container-page grid grid-cols-1 items-center gap-12 py-12 sm:py-16 lg:grid-cols-12 lg:gap-10 lg:py-20">
          <div className="lg:col-span-6">
            <p className="eyebrow">Plateforme citoyenne du Sénégal</p>
            <h1 className="mt-5 text-[2.5rem] leading-[1.05] font-semibold sm:text-5xl lg:text-[3.6rem]">
              Construisons nos communes,{" "}
              <span className="text-brand-700">ensemble.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone-600">
              Bokna rapproche les habitants de leur commune. Découvrez votre territoire, proposez
              vos idées et participez concrètement à la vie municipale.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#regions" className="btn btn-primary btn-lg">
                Explorer les régions
                <Icon name="arrow-right" className="size-4" />
              </a>
              <Link href="/idees/nouvelle" className="btn btn-secondary btn-lg">
                <Icon name="lightbulb" className="size-4 text-accent-600" />
                Proposer une idée
              </Link>
            </div>

            <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-stone-200 pt-8 sm:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dd className="font-display text-3xl font-semibold tracking-tight text-ink">
                    {stat.value.toLocaleString("fr-FR")}
                  </dd>
                  <dt className="mt-1 text-sm text-stone-500">{stat.label}</dt>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative lg:col-span-6">
            <div className="relative overflow-hidden rounded-3xl border border-stone-200/80 bg-stone-100/70 p-5 sm:p-8">
              <svg
                aria-hidden
                className="absolute -right-32 -bottom-32 size-[26rem] text-stone-300/60"
                viewBox="0 0 200 200"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.75"
              >
                <circle cx="100" cy="100" r="30" />
                <circle cx="100" cy="100" r="52" />
                <circle cx="100" cy="100" r="74" />
                <circle cx="100" cy="100" r="96" />
              </svg>

              <div className="relative space-y-4">
                {latestIdea ? (
                  <Link href={`/idees/${latestIdea.id}`} className="card card-interactive group block p-5 sm:p-6">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-semibold tracking-[0.12em] text-stone-500 uppercase">Dernière idée publiée</p>
                      <Badge tone="brand">
                        <Icon name={ideaCategories[latestIdea.category].icon} className="size-3.5" />
                        {ideaCategories[latestIdea.category].label}
                      </Badge>
                    </div>
                    <p className="mt-4 font-display text-xl leading-snug font-semibold text-ink group-hover:text-brand-700">
                      {latestIdea.title}
                    </p>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-stone-600">{latestIdea.description}</p>
                    <div className="mt-5 flex items-center justify-between gap-3 border-t border-stone-100 pt-4 text-sm">
                      <span className="flex min-w-0 items-center gap-2 text-stone-600">
                        <Avatar name={latestIdea.author.name} size="sm" />
                        <span className="truncate">
                          {latestIdea.author.name} · {latestIdea.commune.name}
                        </span>
                      </span>
                      <span className="flex shrink-0 items-center gap-3 font-medium text-stone-500">
                        <span className="flex items-center gap-1">
                          <Icon name="thumbs-up" className="size-4" />
                          {latestIdea._count.votes}
                        </span>
                        <span className="flex items-center gap-1">
                          <Icon name="message" className="size-4" />
                          {latestIdea._count.comments}
                        </span>
                      </span>
                    </div>
                  </Link>
                ) : (
                  <Link href="/idees/nouvelle" className="card card-interactive block p-6">
                    <p className="font-display text-xl font-semibold text-ink">Soyez le premier à proposer une idée</p>
                    <p className="mt-2 text-sm text-stone-600">Votre commune attend vos propositions.</p>
                  </Link>
                )}

                <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto]">
                  {latestNews && (
                    <Link href={`/actualites/${latestNews.id}`} className="card card-interactive group flex items-center gap-4 p-4">
                      <span className="flex w-12 shrink-0 flex-col items-center rounded-lg border border-stone-200 bg-paper py-1.5">
                        <span className="font-display text-lg leading-none font-semibold text-ink">
                          {latestNews.publishedAt.getDate()}
                        </span>
                        <span className="mt-0.5 text-[10px] font-semibold tracking-wide text-stone-500 uppercase">
                          {formatDate(latestNews.publishedAt, { month: "short" }).replace(".", "")}
                        </span>
                      </span>
                      <span className="min-w-0">
                        <span className="block text-xs font-medium text-accent-700">{newsTypes[latestNews.type].label}</span>
                        <span className="block truncate text-sm font-semibold text-ink group-hover:text-brand-700">
                          {latestNews.title}
                        </span>
                      </span>
                    </Link>
                  )}
                  <div className="card flex items-center gap-3 p-4">
                    <span className="icon-tile bg-accent-50 text-accent-700 ring-accent-600/15">
                      <Icon name="building" className="size-5" />
                    </span>
                    <span>
                      <span className="block font-display text-lg leading-tight font-semibold text-ink">
                        {communeCount.toLocaleString("fr-FR")}
                      </span>
                      <span className="block text-xs text-stone-500">communes sur Bokna</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="container-page py-16 sm:py-20">
        <div className="max-w-2xl">
          <p className="eyebrow">Comment ça marche</p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Trois façons d&apos;agir pour votre commune</h2>
        </div>
        <ol className="mt-10 grid gap-5 md:grid-cols-3">
          {steps.map((step, i) => (
            <li key={step.title} className="card p-6 sm:p-7">
              <div className="flex items-center justify-between">
                <span className="icon-tile">
                  <Icon name={step.icon} className="size-5" />
                </span>
                <span className="font-display text-sm font-semibold text-stone-300">0{i + 1}</span>
              </div>
              <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Régions */}
      <section id="regions" className="scroll-mt-20 border-t border-stone-200/70 bg-white">
        <div className="container-page py-16 sm:py-20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="eyebrow">Le territoire</p>
              <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Explorez les régions du Sénégal</h2>
              <p className="mt-3 text-stone-600">
                Choisissez votre région pour découvrir ses départements, ses communes et leurs
                projets.
              </p>
            </div>
            <p className="text-sm text-stone-500">{plural(regions.length, "région")}</p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {regions.map((region) => {
              const communeTotal = region.departments.reduce((sum, dept) => sum + dept._count.communes, 0);

              return (
                <Link
                  key={region.id}
                  href={`/regions/${region.slug}`}
                  className="card card-interactive group flex flex-col overflow-hidden"
                >
                  <div className="relative aspect-[3/2] overflow-hidden border-b border-stone-100 bg-white">
                    <Image
                      src={regionImage(region.slug)}
                      alt={`Carte de la région de ${region.name}`}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-contain p-2 transition duration-700 ease-soft group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="flex flex-1 items-start justify-between gap-4 p-5">
                    <div>
                      <h3 className="text-lg font-semibold">{region.name}</h3>
                      <p className="mt-0.5 text-sm text-stone-500">{region.name} la bokk</p>
                      <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-stone-600">
                        <span className="flex items-center gap-1.5">
                          <Icon name="layers" className="size-3.5 text-stone-400" />
                          {plural(region.departments.length, "département")}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Icon name="building" className="size-3.5 text-stone-400" />
                          {plural(communeTotal, "commune")}
                        </span>
                      </p>
                    </div>
                    <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full border border-stone-200 text-stone-500 transition group-hover:border-brand-700 group-hover:bg-brand-700 group-hover:text-white">
                      <Icon name="arrow-right" className="size-4" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Appel à l'action */}
      <section className="container-page py-16 sm:py-20">
        <div className="relative overflow-hidden rounded-3xl bg-brand-900 px-6 py-12 text-white sm:px-12 sm:py-14">
          <svg
            aria-hidden
            className="absolute -top-24 -right-24 size-80 text-white/[0.06]"
            viewBox="0 0 200 200"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="100" cy="100" r="40" />
            <circle cx="100" cy="100" r="62" />
            <circle cx="100" cy="100" r="84" />
            <circle cx="100" cy="100" r="99" />
          </svg>
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <h2 className="text-3xl font-semibold text-white sm:text-4xl">Votre commune a besoin de vos idées.</h2>
              <p className="mt-3 text-brand-100">
                Créez votre compte citoyen en une minute et faites entendre votre voix.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/idees/nouvelle" className="btn btn-accent btn-lg">
                Proposer une idée
              </Link>
              <Link
                href="/idees"
                className="btn btn-lg border border-white/25 text-white hover:border-white/40 hover:bg-white/10"
              >
                Parcourir les idées
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
