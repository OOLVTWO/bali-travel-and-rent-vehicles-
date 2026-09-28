import type { Level } from "@/components/admin/ui";
import { asKind, asStatus, kindLabel, revenueStatuses, statusLabel, statusLevel } from "@/lib/booking-meta";
import { addDays, diffDays, formatDayLabel, formatShort, isoFromTimestamp } from "@/lib/dates";
import type { Tables } from "@/lib/supabase/database.types";
import type { createClient } from "@/lib/supabase/server";

type Supabase = Awaited<ReturnType<typeof createClient>>;

export type BookingRow = Tables<"bookings">;
export type UnitRow = Tables<"fleet_units"> & { vehicle_name: string };

export async function loadBookings(supabase: Supabase, limit = 500): Promise<BookingRow[]> {
  const { data, error } = await supabase.from("bookings").select("*").order("created_at", { ascending: false }).limit(limit);
  if (error) throw new Error(error.message);
  return data;
}

export async function loadUnits(supabase: Supabase): Promise<UnitRow[]> {
  const { data, error } = await supabase.from("fleet_units").select("*, vehicles(name)").order("plate");
  if (error) throw new Error(error.message);
  return data.map(({ vehicles, ...u }) => ({ ...u, vehicle_name: vehicles?.name ?? "–" }));
}

// ---------------------------------------------------------------------------
// Jadwal armada
// ---------------------------------------------------------------------------

export type ScheduleBlock = { start: number; end: number; kind: "rental" | "tour" | "servis"; label: string; title: string; conflict: boolean };
export type ScheduleRow = { unit: string; plate: string; blocks: ScheduleBlock[] };
export type ScheduleData = { days: string[]; todayIndex: number; rows: ScheduleRow[]; conflicts: number };

/** Blok per unit untuk 7 hari mulai `weekStartIso`. Booking yang tumpang tindih di unit yang sama ditandai konflik. */
export function buildSchedule(bookings: BookingRow[], units: UnitRow[], weekStartIso: string, today: string): ScheduleData {
  const weekEnd = addDays(weekStartIso, 6);
  const days = Array.from({ length: 7 }, (_, i) => formatDayLabel(addDays(weekStartIso, i)));
  const todayOffset = diffDays(weekStartIso, today);
  let conflicts = 0;

  const rows = units
    .filter((u) => u.status !== "nonaktif")
    .map((u) => {
      if (u.status === "servis") {
        return { unit: u.vehicle_name, plate: u.plate, blocks: [{ start: 0, end: 7, kind: "servis" as const, label: "Servis", title: "Unit sedang servis", conflict: false }] };
      }
      const mine = bookings
        .filter((b) => b.unit_id === u.id && b.status !== "batal" && b.start_date)
        .map((b) => ({ b, s: b.start_date as string, e: b.end_date ?? (b.start_date as string) }))
        .filter(({ s, e }) => e >= weekStartIso && s <= weekEnd)
        .sort((x, y) => x.s.localeCompare(y.s));
      const blocks: ScheduleBlock[] = mine.map(({ b, s, e }, i) => {
        const overlaps = mine.some((o, j) => j !== i && o.s <= e && s <= o.e);
        if (overlaps) conflicts++;
        const kind = asKind(b.kind) === "rental" ? "rental" : "tour";
        return {
          start: Math.max(0, diffDays(weekStartIso, s)),
          end: Math.min(6, diffDays(weekStartIso, e)) + 1,
          kind,
          label: `${b.code} · ${b.guest_name}`,
          title: `${b.code} · ${b.item_title} · ${formatShort(s)}–${formatShort(e)}`,
          conflict: overlaps,
        };
      });
      return { unit: u.vehicle_name, plate: u.plate, blocks };
    });

  return { days, todayIndex: todayOffset >= 0 && todayOffset < 7 ? todayOffset : -1, rows, conflicts: Math.ceil(conflicts / 2) };
}

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------

export type ActionItem = { id: string; code: string; title: string; detail: string; level: Level; label: string };
export type Handover = { id: string; kind: "Antar" | "Ambil"; code: string; guest: string; unit: string; place: string; level: Level; label: string };

export function computeDashboard(bookings: BookingRow[], units: UnitRow[], today: string) {
  const yesterday = addDays(today, -1);
  const month = today.slice(0, 7);
  const unitName = new Map(units.map((u) => [u.id, `${u.vehicle_name} ${u.plate}`]));
  const live = bookings.filter((b) => b.status !== "batal");

  const bookingsToday = bookings.filter((b) => isoFromTimestamp(b.created_at) === today).length;
  const bookingsYesterday = bookings.filter((b) => isoFromTimestamp(b.created_at) === yesterday).length;

  const monthRevenueRows = live.filter((b) => revenueStatuses.includes(asStatus(b.status)) && b.start_date?.startsWith(month));
  const revenueMonth = monthRevenueRows.reduce((sum, b) => sum + (b.estimated_total ?? 0), 0);

  const activeUnits = units.filter((u) => u.status !== "nonaktif");
  const busyUnitIds = new Set(
    live.filter((b) => b.unit_id && b.start_date && b.start_date <= today && (b.end_date ?? b.start_date) >= today).map((b) => b.unit_id as string),
  );
  const unitsOut = activeUnits.filter((u) => busyUnitIds.has(u.id)).length;

  const needsUnit = (b: BookingRow) => ["rental", "driver", "transfer"].includes(b.kind) && !b.unit_id;
  const actions: ActionItem[] = [];
  for (const b of live) {
    const status = asStatus(b.status);
    const when = b.start_date ? formatShort(b.start_date) : "tanggal belum diisi";
    if (status === "baru") {
      actions.push({ id: b.id, code: b.code, title: `${b.code} · ${b.item_title}`, detail: `${b.guest_name} · ${when} · masuk ${formatShort(isoFromTimestamp(b.created_at))}`, level: "bad", label: "Perlu konfirmasi" });
    } else if (status === "menunggu-dp") {
      actions.push({ id: b.id, code: b.code, title: `${b.code} · ${b.item_title}`, detail: `${b.guest_name} · ${when}`, level: "warn", label: statusLabel[status] });
    } else if (status === "dikonfirmasi" && needsUnit(b) && b.start_date && b.start_date <= addDays(today, 2) && b.start_date >= today) {
      actions.push({ id: b.id, code: b.code, title: `${b.code} · ${b.item_title}`, detail: `${b.guest_name} · mulai ${when}`, level: "bad", label: "Belum ada unit" });
    }
  }
  for (const u of units) {
    if (u.status !== "nonaktif" && u.next_service && u.next_service <= addDays(today, 7)) {
      actions.push({ id: u.id, code: u.plate, title: `${u.vehicle_name} ${u.plate}`, detail: `Servis jatuh tempo ${formatShort(u.next_service)}`, level: "neutral", label: "Servis" });
    }
  }

  const revenueByKind = (Object.keys(kindLabel) as (keyof typeof kindLabel)[])
    .map((k) => ({ label: kindLabel[k], value: monthRevenueRows.filter((b) => asKind(b.kind) === k).reduce((s, b) => s + (b.estimated_total ?? 0), 0) }))
    .sort((a, b) => b.value - a.value);

  const handovers: Handover[] = [];
  for (const b of live) {
    if (!["rental", "driver", "transfer"].includes(b.kind)) continue;
    const unit = b.unit_id ? unitName.get(b.unit_id) ?? "–" : "Belum ada unit";
    const status = asStatus(b.status);
    if (b.start_date === today) {
      handovers.push({ id: b.id, kind: "Antar", code: b.code, guest: b.guest_name, unit, place: b.location ?? "–", level: b.unit_id ? statusLevel[status] : "bad", label: b.unit_id ? statusLabel[status] : "Butuh unit" });
    }
    if (b.end_date && b.end_date === today && b.end_date !== b.start_date) {
      handovers.push({ id: `${b.id}-back`, kind: "Ambil", code: b.code, guest: b.guest_name, unit, place: b.location ?? "–", level: "neutral", label: "Ambil hari ini" });
    }
  }

  return {
    bookingsToday,
    bookingsYesterday,
    revenueMonth,
    revenueMonthCount: monthRevenueRows.length,
    unitsOut,
    unitsActive: activeUnits.length,
    actions,
    revenueByKind,
    handovers,
  };
}
