import type { Metadata } from "next";
import Link from "next/link";
import { actionItems, handovers, kpis, revenueByService } from "@/data/admin";
import { FleetSchedule } from "@/components/admin/FleetSchedule";
import { Card, PageTitle, StatusChip } from "@/components/admin/ui";
import { Bell, Plus, Search } from "@/components/icons";
import { rupiahShort } from "@/lib/format";

export const metadata: Metadata = { title: "Dashboard" };

export default function AdminDashboard() {
  const revenuePct = Math.round((kpis.revenueMonth / kpis.revenueTarget) * 100);
  const utilPct = Math.round((kpis.unitsOut / kpis.unitsTotal) * 100);
  const maxRevenue = Math.max(...revenueByService.map((r) => r.value));
  const totalRevenue = revenueByService.reduce((s, r) => s + r.value, 0);

  return (
    <>
      <PageTitle
        title="Selamat pagi, Admin"
        subtitle={`Senin, 28 September · ${handovers.length} serah terima kendaraan hari ini`}
        actions={
          <>
            <label className="flex h-11 w-full items-center gap-2.5 rounded-xl border border-line bg-white px-3.5 text-sm text-muted sm:w-80">
              <Search size={18} className="shrink-0" />
              <span className="sr-only">Cari</span>
              <input type="search" placeholder="Cari booking, tamu, plat nomor…" className="w-full bg-transparent text-ink outline-none placeholder:text-muted" />
            </label>
            <button type="button" aria-label="Notifikasi" className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-white">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-sea" />
            </button>
            <Link href="/admin/bookings" className="flex h-11 items-center gap-2 rounded-xl bg-sun px-4.5 text-sm font-bold text-ink">
              <Plus size={18} /> Booking baru
            </Link>
          </>
        }
      />

      <div className="grid gap-4.5 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Booking hari ini" value={String(kpis.bookingsToday)}>
          <span><strong className="text-sea-dark">+{kpis.bookingsDelta}</strong> dibanding Senin lalu</span>
        </Kpi>
        <Kpi label="Pendapatan bulan ini" value={rupiahShort(kpis.revenueMonth)}>
          <span className="flex items-center gap-2.5">
            <span className="h-2 flex-1 overflow-hidden rounded-full bg-line-soft" role="progressbar" aria-valuenow={revenuePct} aria-valuemin={0} aria-valuemax={100} aria-label="Progres target">
              <span className="block h-full bg-sea" style={{ width: `${Math.min(100, revenuePct)}%` }} />
            </span>
            {revenuePct}% dari target
          </span>
        </Kpi>
        <Kpi label="Utilisasi armada" value={`${utilPct}%`}>
          <span>{kpis.unitsOut} dari {kpis.unitsTotal} unit sedang jalan</span>
        </Kpi>
        <Kpi label="Perlu tindakan" value={String(kpis.needsAction)} highlight>
          <span>{kpis.urgent} harus dibalas &lt; 1 jam</span>
        </Kpi>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <Card title="Jadwal armada minggu ini" subtitle="Satu unit bisa dipakai rental & tour, jadi gak ada yang nganggur" action={<Link href="/admin/schedule" className="text-[13px] font-bold text-sea">Buka kalender</Link>}>
          <FleetSchedule />
        </Card>
        <Card title="Perlu tindakan" action={<Link href="/admin/bookings" className="text-[13px] font-bold text-sea">Lihat semua</Link>}>
          <ul className="flex flex-col">
            {actionItems.map((a, i) => (
              <li key={a.title} className={`flex flex-col gap-1.5 py-3 ${i < actionItems.length - 1 ? "border-b border-line-soft" : ""}`}>
                <span className="flex items-start justify-between gap-3">
                  <span className="text-sm font-bold">{a.title}</span>
                  <StatusChip level={a.level}>{a.label}</StatusChip>
                </span>
                <span className="text-[13px] text-muted">{a.detail}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[520px_1fr]">
        <Card title="Pendapatan per layanan" subtitle={`September · total ${rupiahShort(totalRevenue)}`}>
          <ul className="flex flex-col gap-3.5">
            {revenueByService.map((r) => (
              <li key={r.label} className="grid grid-cols-[130px_1fr] items-center gap-3 text-[13px] sm:grid-cols-[150px_1fr]">
                <span className="font-semibold">{r.label}</span>
                <span className="flex items-center gap-2.5">
                  <span className="h-5 rounded-r bg-rental" style={{ width: `${(r.value / maxRevenue) * 70}%` }} />
                  <span className="font-bold whitespace-nowrap tabular-nums">{rupiahShort(r.value)}</span>
                </span>
              </li>
            ))}
          </ul>
        </Card>
        <Card title="Serah terima hari ini" action={<Link href="/admin/schedule" className="text-[13px] font-bold text-sea">Buka di kalender</Link>}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-[13px]">
              <thead>
                <tr className="text-left text-xs text-muted">
                  <th className="py-2 font-bold">Jam</th>
                  <th className="py-2 font-bold">Booking</th>
                  <th className="py-2 font-bold">Unit</th>
                  <th className="py-2 font-bold">Lokasi</th>
                  <th className="py-2 font-bold">Status</th>
                </tr>
              </thead>
              <tbody>
                {handovers.map((h) => (
                  <tr key={h.booking} className="border-t border-line-soft">
                    <td className="py-2.5 font-bold tabular-nums">{h.time}</td>
                    <td className="py-2.5">{h.booking}</td>
                    <td className="py-2.5">{h.unit}</td>
                    <td className="py-2.5">{h.place}</td>
                    <td className="py-2.5"><StatusChip level={h.level}>{h.label}</StatusChip></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
