"use client";

export function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex min-h-11 w-full items-center justify-between gap-4 text-left text-sm font-semibold"
    >
      {label}
      <span className={`relative h-6.5 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-sea" : "bg-line"}`}>
        <span className={`absolute top-0.75 h-5 w-5 rounded-full bg-white shadow transition-[left] ${checked ? "left-5.25" : "left-0.75"}`} />
      </span>
    </button>
  );
}
