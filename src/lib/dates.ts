// Semua tanggal pakai zona waktu Bali (WITA, UTC+8) dan format ISO "YYYY-MM-DD".

const witaDate = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Makassar", year: "numeric", month: "2-digit", day: "2-digit" });

export function todayWita(now = new Date()) {
  return witaDate.format(now);
}

export function isoFromTimestamp(ts: string) {
  return witaDate.format(new Date(ts));
}

function toUtc(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function addDays(iso: string, days: number) {
  const d = toUtc(iso);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function diffDays(from: string, to: string) {
  return Math.round((toUtc(to).getTime() - toUtc(from).getTime()) / 86_400_000);
}

/** Senin di minggu yang sama */
export function weekStart(iso: string) {
  const day = toUtc(iso).getUTCDay(); // 0 = Minggu
  return addDays(iso, day === 0 ? -6 : 1 - day);
}

const shortFmt = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", timeZone: "UTC" });
const dayFmt = new Intl.DateTimeFormat("id-ID", { weekday: "short", timeZone: "UTC" });
const longFmt = new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });

/** "28 Sep" */
export function formatShort(iso: string | null | undefined) {
  return iso ? shortFmt.format(toUtc(iso)) : "–";
}

/** "Sen 28" */
export function formatDayLabel(iso: string) {
  return `${dayFmt.format(toUtc(iso)).replace(".", "")} ${toUtc(iso).getUTCDate()}`;
}

/** "Senin, 28 September" */
export function formatLong(iso: string) {
  return longFmt.format(toUtc(iso));
}

/** "28 Sep – 1 Okt" atau "28 Sep" */
export function formatRange(start: string | null, end: string | null) {
  if (!start) return "–";
  if (!end || end === start) return formatShort(start);
  return `${formatShort(start)} – ${formatShort(end)}`;
}
