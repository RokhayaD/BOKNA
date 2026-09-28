import { Icon, type IconName } from "@/components/ui/Icon";

const tones: Record<string, { box: string; icon: IconName; iconColor: string }> = {
  success: { box: "bg-brand-50 text-brand-900 ring-brand-700/15", icon: "check-circle", iconColor: "text-brand-700" },
  error: { box: "bg-red-50 text-red-800 ring-red-600/15", icon: "alert-circle", iconColor: "text-red-600" },
  warning: { box: "bg-amber-50 text-amber-900 ring-amber-600/20", icon: "clock", iconColor: "text-amber-600" },
};

export function Alert({
  tone,
  children,
}: {
  tone: "success" | "error" | "warning";
  children: React.ReactNode;
}) {
  const t = tones[tone];
  return (
    <div role={tone === "error" ? "alert" : "status"} className={`flex gap-3 rounded-xl px-4 py-3 text-sm ring-1 ring-inset ${t.box}`}>
      <Icon name={t.icon} className={`mt-px size-[18px] shrink-0 ${t.iconColor}`} />
      <div className="leading-relaxed">{children}</div>
    </div>
  );
}
