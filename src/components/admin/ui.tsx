import { Alert, Calendar, Check, Clock, Wrench } from "@/components/icons";

export type Level = "bad" | "warn" | "info" | "neutral" | "good";

const chipStyle: Record<Level, string> = {
  bad: "bg-bad-bg text-bad",
  warn: "bg-warn-bg text-warn",
  info: "bg-sea-soft text-sea-dark",
  neutral: "bg-neutral-bg text-body",
  good: "bg-sea-soft text-sea-dark",
};

const chipIcon: Record<Level, typeof Alert> = {
  bad: Alert,
  warn: Clock,
  info: Calendar,
  neutral: Wrench,
  good: Check,
};

/** Chip status: selalu ada ikon + teks, bukan warna saja. */
export function StatusChip({ level, children }: { level: Level; children: React.ReactNode }) {
  const Icon = chipIcon[level];
  return (
    <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold whitespace-nowrap ${chipStyle[level]}`}>
      <Icon size={13} strokeWidth={2.4} />
      {children}
    </span>
  );
}

export function Card({ title, subtitle, action, children, className = "" }: { title?: string; subtitle?: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={`flex min-w-0 flex-col gap-4 rounded-[18px] bg-white p-5 sm:p-6 ${className}`}>
      {(title || action) && (
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-col gap-0.5">
            {title && <h2 className="text-[17px] font-bold">{title}</h2>}
            {subtitle && <span className="text-[13px] text-muted">{subtitle}</span>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function PageTitle({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-[28px] font-semibold sm:text-[30px]">{title}</h1>
        {subtitle && <span className="text-sm text-muted">{subtitle}</span>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
    </div>
  );
}
