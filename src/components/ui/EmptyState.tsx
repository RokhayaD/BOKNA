import { Icon, type IconName } from "@/components/ui/Icon";

export function EmptyState({
  icon = "inbox",
  title,
  children,
  action,
}: {
  icon?: IconName;
  title: string;
  children?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-stone-300 bg-white/60 px-6 py-12 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-stone-100 text-stone-500">
        <Icon name={icon} className="size-6" />
      </span>
      <p className="mt-4 font-display text-base font-semibold text-ink">{title}</p>
      {children && <p className="mt-1 max-w-sm text-sm text-stone-500">{children}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
