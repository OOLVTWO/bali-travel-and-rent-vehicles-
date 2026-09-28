import type { Metadata } from "next";
import Link from "next/link";
import { FleetSchedule } from "@/components/admin/FleetSchedule";
import { Card, PageTitle, StatusChip } from "@/components/admin/ui";
import { ArrowLeft, ArrowRight } from "@/components/icons";
import { buildSchedule, loadBookings, loadUnits } from "@/lib/admin-data";
import { addDays, formatShort, todayWita, weekStart } from "@/lib/dates";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Kalender armada" };

export default async function SchedulePage({ searchParams }: PageProps<"/admin/schedule">) {
  const { w } = await searchParams;
  const offset = Math.max(-52, Math.min(52, Math.trunc(Number(Array.isArray(w) ? w[0] : w) || 0)));
  const today = todayWita();
  const start = addDays(weekStart(today), offset * 7);

  const supabase = await createClient();
  const [bookings, units] = await Promise.all([loadBookings(supabase, 1000), loadUnits(supabase)]);
  const data = buildSchedule(bookings, units, start, today);

  const nav = "flex h-11 items-center gap-1.5 rounded-xl border border-line bg-white px-3.5 text-sm font-bold hover:bg-mist";
  const weekTitle = offset === 0 ? "Minggu ini" : offset === 1 ? "Minggu depan" : offset === -1 ? "Minggu lalu" : `${formatShort(start)} – ${formatShort(addDays(start, 6))}`;

  return (
    <>
      <PageTitle
        title="Kalender armada"
        subtitle={`${formatShort(start)} – ${formatShort(addDays(start, 6))} · semua unit motor & mobil`}
        actions={
          <>
            <Link href={`/admin/schedule?w=${offset - 1}`} className={nav}><ArrowLeft size={18} /> Sebelumnya</Link>
            {offset !== 0 && <Link href="/admin/schedule" className={nav}>Minggu ini</Link>}
            <Link href={`/admin/schedule?w=${offset + 1}`} className={nav}>Berikutnya <ArrowRight size={18} /></Link>
          </>
        }
      />
      <Card
        title={weekTitle}
        subtitle="Toska = rental, oranye = tour/driver, arsir = servis. Arahkan kursor ke blok buat lihat detail. Pasang unit ke booking di menu Booking."
        action={data.conflicts > 0 ? <StatusChip level="bad">{data.conflicts} jadwal bentrok</StatusChip> : undefined}
      >
        <FleetSchedule data={data} />
      </Card>
    </>
  );
}
