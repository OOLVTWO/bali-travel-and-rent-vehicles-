import type { Metadata } from "next";
import Link from "next/link";
import { FleetSchedule } from "@/components/admin/FleetSchedule";
import { Card, PageTitle, StatusChip } from "@/components/admin/ui";
import { Plus } from "@/components/icons";
import { buildSchedule, computeDashboard, loadBookings, loadUnits } from "@/lib/admin-data";
import { formatLong, todayWita, weekStart } from "@/lib/dates";
import { rupiahShort } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Dashboard" };

const monthFmt = new Intl.DateTimeFormat("id-ID", { month: "long", timeZone: "Asia/Makassar" });

function greeting() {
  const hour = Number(new Intl.DateTimeFormat("en-GB", { hour: "numeric", hourCycle: "h23", timeZone: "Asia/Makassar" }).format(new Date()));
  if (hour < 11) return "Selamat pagi";
  if (hour < 15) return "Selamat siang";
  if (hour < 18) return "Selamat sore";
  return "Selamat malam";
}

export default async function AdminDashboard() {
  const supabase = await createClient();
  const [bookings, units] = await Promise.all([loadBookings(supabase), loadUnits(supabase)]);
  const today = todayWita();
  const d = computeDashboard(bookings, units, today);
  const schedule = buildSchedule(bookings, units, weekStart(today), today);

  const utilPct = d.unitsActive ? Math.round((d.unitsOut / d.unitsActive) * 100) : 0;
  const delta = d.bookingsToday - d.bookingsYesterday;
  const urgent = d.actions.filter((a) => a.level === "bad").length;
  const revenueRows = d.revenueByKind.filter((r) => r.value > 0);
  const maxRevenue = Math.max(1, ...revenueRows.map((r) => r.value));

  return (
    <>
      <PageTitle
        title={`${greeting()}, Admin`}
        subtitle={`${formatLong(today)} · ${d.handovers.length} serah terima kendaraan hari ini`}
        actions={
          <Link href="/admin/bookings?baru=1" className="flex h-11 items-center gap-2 rounded-xl bg-sun px-4.5 text-sm font-bold text-ink">
            <Plus size={18} /> Booking baru
          </Link>
        }
      />

      <div className="grid gap-4.5 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Booking masuk hari ini" value={String(d.bookingsToday)}>
          <span>
            <strong className={delta >= 0 ? "text-sea-dark" : "text-bad"}>{delta >= 0 ? `+${delta}` : delta}</strong> dibanding kemarin
          </span>
        </Kpi>
        <Kpi label="Pendapatan bulan ini" value={rupiahShort(d.revenueMonth)}>
          <span>Dari {d.revenueMonthCount} booking terkonfirmasi</span>
        </Kpi>
        <Kpi label="Utilisasi armada" value={`${utilPct}%`}>
          <span>{d.unitsActive ? `${d.unitsOut} dari ${d.unitsActive} unit sedang jalan` : "Belum ada unit terdaftar"}</span>
        </Kpi>
        <Kpi label="Perlu tindakan" value={String(d.actions.length)} highlight={d.actions.length > 0}>
          <span>{urgent ? `${urgent} harus dibalas secepatnya` : "Aman, gak ada yang mendesak"}</span>
        </Kpi>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <Card title="Jadwal armada minggu ini" subtitle="Satu unit bisa dipakai rental & tour, jadi gak ada yang nganggur" action={<Link href="/admin/schedule" className="text-[13px] font-bold text-sea">Buka kalender</Link>}>
          <FleetSchedule data={schedule} />
        </Card>
        <Card title="Perlu tindakan" action={<Link href="/admin/bookings" className="text-[13px] font-bold text-sea">Lihat semua</Link>}>
          {d.actions.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted">Semua beres. Booking baru dari website bakal muncul di sini.</p>
          ) : (
            <ul className="flex flex-col">
              {d.actions.slice(0, 8).map((a, i, list) => (
                <li key={`${a.id}-${a.label}`} className={`flex flex-col gap-1.5 py-3 ${i < list.length - 1 ? "border-b border-line-soft" : ""}`}>
                  <span className="flex items-start justify-between gap-3">
                    <span className="text-sm font-bold">{a.title}</span>
                    <StatusChip level={a.level}>{a.label}</StatusChip>
                  </span>
                  <span className="text-[13px] text-muted">{a.detail}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[520px_1fr]">
        <Card title="Pendapatan per layanan" subtitle={`${monthFmt.format(new Date())} · total ${rupiahShort(d.revenueMonth)}`}>
          {revenueRows.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted">Belum ada booking terkonfirmasi bulan ini.</p>
          ) : (
            <ul className="flex flex-col gap-3.5">
              {revenueRows.map((r) => (
                <li key={r.label} className="grid grid-cols-[130px_1fr] items-center gap-3 text-[13px] sm:grid-cols-[150px_1fr]">
                  <span className="font-semibold">{r.label}</span>
                  <span className="flex items-center gap-2.5">
                    <span className="h-5 rounded-r bg-rental" style={{ width: `${Math.max(2, (r.value / maxRevenue) * 70)}%` }} />
                    <span className="font-bold whitespace-nowrap tabular-nums">{rupiahShort(r.value)}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card title="Serah terima hari ini" action={<Link href="/admin/schedule" className="text-[13px] font-bold text-sea">Buka di kalender</Link>}>
          {d.handovers.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted">Gak ada antar/ambil kendaraan hari ini.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-[13px]">
                <thead>
                  <tr className="text-left text-xs text-muted">
                    <th className="py-2 font-bold">Jenis</th>
                    <th className="py-2 font-bold">Booking</th>
                    <th className="py-2 font-bold">Unit</th>
                    <th className="py-2 font-bold">Lokasi</th>
                    <th className="py-2 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {d.handovers.map((h) => (
                    <tr key={h.id} className="border-t border-line-soft">
                      <td className="py-2.5 font-bold">{h.kind}</td>
                      <td className="py-2.5">{h.code} · {h.guest}</td>
                      <td className="py-2.5">{h.unit}</td>
                      <td className="py-2.5">{h.place}</td>
                      <td className="py-2.5"><StatusChip level={h.level}>{h.label}</StatusChip></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}

function Kpi({ label, value, highlight = false, children }: { label: string; value: string; highlight?: boolean; children: React.ReactNode }) {
  return (
    <div className={`flex flex-col gap-2 rounded-2xl bg-white p-5 ${highlight ? "ring-2 ring-sun" : ""}`}>
      <span className="text-[13px] font-semibold text-muted">{label}</span>
      <span className="text-[32px] leading-tight font-bold tracking-tight tabular-nums">{value}</span>
      <span className="text-[13px] text-body">{children}</span>
    </div>
  );
}
