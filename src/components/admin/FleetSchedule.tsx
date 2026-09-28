import Link from "next/link";
import type { ScheduleBlock, ScheduleData } from "@/lib/admin-data";

const blockStyle: Record<ScheduleBlock["kind"], string> = {
  rental: "bg-rental",
  tour: "bg-tour",
  servis: "hatch",
};

/** Kalender armada: satu baris per unit, blok per booking. Rental & tour pakai unit yang sama. */
export function FleetSchedule({ data }: { data: ScheduleData }) {
  const { days, todayIndex, rows } = data;
  const cols = "grid-cols-[150px_repeat(7,minmax(56px,1fr))]";

  if (rows.length === 0) {
    return (
      <p className="rounded-xl bg-mist px-4 py-6 text-center text-sm text-muted">
        Belum ada unit aktif. Tambahin plat nomor di menu <Link href="/admin/fleet" className="font-bold text-sea">Armada</Link> dulu.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <ul className="flex flex-wrap gap-4 text-[13px] text-body" aria-label="Keterangan">
        <li className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-[3px] bg-rental" />Rental</li>
        <li className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-[3px] bg-tour" />Tour / driver</li>
        <li className="flex items-center gap-1.5"><span className="hatch h-3 w-3 rounded-[3px]" />Servis</li>
        {data.conflicts > 0 && <li className="flex items-center gap-1.5 font-bold text-bad"><span className="h-3 w-3 rounded-[3px] ring-2 ring-bad ring-inset" />Bentrok</li>}
      </ul>
      <div className="overflow-x-auto">
        <div className="relative min-w-[600px]" aria-hidden="true">
          {todayIndex >= 0 && (
            <div
              className="absolute top-0 bottom-0 rounded-lg bg-[#fff8e1]"
              style={{ left: `calc(150px + (100% - 150px) / 7 * ${todayIndex})`, width: "calc((100% - 150px) / 7)" }}
            />
          )}
          <div className={`relative grid ${cols} h-9 items-center border-b border-line-soft text-xs font-bold text-muted`}>
            <span>Unit</span>
            {days.map((d, i) => (
              <span key={d} className={`text-center ${i === todayIndex ? "text-sea" : ""}`}>{d}</span>
            ))}
          </div>
          {rows.map((row, r) => (
            <div key={row.plate} className={`relative grid ${cols} min-h-11.5 items-center py-1 text-xs font-semibold ${r < rows.length - 1 ? "border-b border-line-soft" : ""}`}>
              <span className="flex flex-col" style={{ gridColumn: 1, gridRow: 1 }}>
                <span className="truncate text-[13px] font-bold">{row.unit}</span>
                <span className="font-medium text-muted">{row.plate}</span>
              </span>
              {row.blocks.map((b, i) => (
                <span
                  key={`${i}-${b.label}`}
                  title={b.title}
                  className={`mx-px flex h-7 items-center overflow-hidden rounded px-2 whitespace-nowrap text-ink ${blockStyle[b.kind]} ${b.conflict ? "ring-2 ring-bad ring-inset" : ""}`}
                  style={{ gridColumn: `${b.start + 2} / ${b.end + 2}`, gridRow: 1 }}
                >
                  {b.label}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <ul className="sr-only" aria-label="Jadwal armada">
        {rows.map((row) => (
          <li key={row.plate}>
            {row.unit} {row.plate}: {row.blocks.length ? row.blocks.map((b) => `${b.title}${b.conflict ? " (bentrok)" : ""}`).join("; ") : "kosong"}
          </li>
        ))}
      </ul>
    </div>
  );
}
