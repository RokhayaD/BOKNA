import { Icon } from "@/components/ui/Icon";

export function FormTips({ title, tips }: { title: string; tips: string[] }) {
  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div className="rounded-2xl border border-stone-200/80 bg-white/60 p-6">
        <p className="font-display text-base font-semibold text-ink">{title}</p>
        <ul className="mt-4 space-y-3">
          {tips.map((tip) => (
            <li key={tip} className="flex gap-3 text-sm leading-relaxed text-stone-600">
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-800">
                <Icon name="check" className="size-3" strokeWidth={2.5} />
              </span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
