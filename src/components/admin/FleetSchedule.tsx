import { schedule, scheduleDays, type ScheduleBlock } from "@/data/admin";

const blockStyle: Record<ScheduleBlock["kind"], string> = {
  rental: "bg-rental",
  tour: "bg-tour",
  servis: "hatch",
};

/** Kalender armada: satu baris per unit, blok per booking. Rental & tour pakai unit yang sama. */
export function FleetSchedule({ todayIndex = 0 }: { todayIndex?: number }) {
  const cols = "grid-cols-[150px_repeat(7,minmax(56px,1fr))]";
  return (
    <div className="flex flex-col gap-3">
      <ul className="flex flex-wrap gap-4 text-[13px] text-body" aria-label="Keterangan">
        <li className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-[3px] bg-rental" />Rental</li>
        <li className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-[3px] bg-tour" />Tour / charter</li>
        <li className="flex items-center gap-1.5"><span className="hatch h-3 w-3 rounded-[3px]" />Servis</li>
      </ul>
      <div className="overflow-x-auto">
        <div className="relative min-w-[600px]" aria-hidden="true">
          <div
            className="absolute top-0 bottom-0 rounded-lg bg-[#fff8e1]"
            style={{ left: `calc(150px + (100% - 150px) / 7 * ${todayIndex})`, width: "calc((100% - 150px) / 7)" }}
          />
          <div className={`relative grid ${cols} h-9 items-center border-b border-line-soft text-xs font-bold text-muted`}>
            <span>Unit</span>
            {scheduleDays.map((d, i) => (
              <span key={d} className={`text-center ${i === todayIndex ? "text-sea" : ""}`}>{d}</span>
            ))}
          </div>
          {schedule.map((row, r) => (
            <div key={row.plate} className={`relative grid ${cols} h-11.5 items-center text-xs font-semibold ${r < schedule.length - 1 ? "border-b border-line-soft" : ""}`}>
              <span className="flex flex-col" style={{ gridColumn: 1, gridRow: 1 }}>
                <span className="text-[13px] font-bold">{row.unit}</span>
                <span className="font-medium text-muted">{row.plate}</span>
              </span>
              {row.blocks.map((b) => (
                <span
                  key={`${b.start}-${b.label}`}
                  title={`${b.label} · ${scheduleDays[b.start]}–${scheduleDays[b.end - 1]}`}
                  className={`mx-px flex h-7 items-center overflow-hidden rounded px-2 whitespace-nowrap text-ink ${blockStyle[b.kind]}`}
                  style={{ gridColumn: `${b.start + 2} / ${b.end + 2}`, gridRow: 1 }}
                >
                  {b.label}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <ul className="sr-only" aria-label="Jadwal armada minggu ini">
        {schedule.map((row) => (
          <li key={row.plate}>
            {row.unit} {row.plate}: {row.blocks.map((b) => `${b.label} (${b.kind}) ${scheduleDays[b.start]} sampai ${scheduleDays[b.end - 1]}`).join("; ")}
          </li>
        ))}
      </ul>
    </div>
  );
}
