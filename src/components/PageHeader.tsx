import Image from "next/image";
import Link from "next/link";
import { Icon, type IconName } from "@/components/ui/Icon";

export type Crumb = { label: string; href?: string };
export type MetaItem = { icon: IconName; label: React.ReactNode };

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  breadcrumb,
  actions,
  meta,
  image,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: React.ReactNode;
  breadcrumb?: Crumb[];
  actions?: React.ReactNode;
  meta?: MetaItem[];
  image?: string;
}) {
  return (
    <section className="border-b border-stone-200/70">
      <div className="container-page py-8 sm:py-12">
        {breadcrumb && breadcrumb.length > 0 && (
          <nav aria-label="Fil d'Ariane" className="mb-6 sm:mb-8">
            <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-stone-500">
              {breadcrumb.map((crumb, i) => {
                const last = i === breadcrumb.length - 1;
                return (
                  <li key={`${crumb.label}-${i}`} className="flex min-w-0 items-center gap-1.5">
                    {crumb.href && !last ? (
                      <Link href={crumb.href} className="transition hover:text-ink">
                        {crumb.label}
                      </Link>
                    ) : (
                      <span
                        aria-current={last ? "page" : undefined}
                        className={last ? "max-w-[16rem] truncate font-medium text-ink" : undefined}
                      >
                        {crumb.label}
                      </span>
                    )}
                    {!last && <Icon name="chevron-right" className="size-3.5 text-stone-400" />}
                  </li>
                );
              })}
            </ol>
          </nav>
        )}

        <div
          className={
            image
              ? "grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,25rem)] lg:items-center lg:gap-12"
              : "flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
          }
        >
          <div className="max-w-3xl">
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            <h1 className="mt-3 text-3xl leading-[1.1] font-semibold sm:text-4xl lg:text-[2.75rem]">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-stone-600 sm:text-lg">
                {subtitle}
              </p>
            )}
            {meta && meta.length > 0 && (
              <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-stone-600">
                {meta.map((item, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <Icon name={item.icon} className="size-4 text-brand-700" />
                    {item.label}
                  </li>
                ))}
              </ul>
            )}
            {image && actions && <div className="mt-7 flex flex-wrap gap-3">{actions}</div>}
          </div>

          {!image && actions && <div className="flex shrink-0 flex-wrap gap-3">{actions}</div>}

          {image && (
            <div className="relative aspect-[3/2] overflow-hidden rounded-2xl bg-white shadow-lift ring-1 ring-stone-900/10">
              <Image
                src={image}
                alt=""
                fill
                priority
                sizes="(min-width: 1024px) 25rem, 100vw"
                className="object-contain p-3"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
