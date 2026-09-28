import type { Metadata } from "next";
import { FleetSchedule } from "@/components/admin/FleetSchedule";
import { Card, PageTitle } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Kalender armada" };

export default function SchedulePage() {
  return (
    <>
      <PageTitle title="Kalender armada" subtitle="28 September – 4 Oktober · semua unit motor & mobil" />
      <Card title="Minggu ini" subtitle="Blok hijau-toska = rental, oranye = tour/charter, arsir = servis. Arahkan kursor ke blok buat lihat detail.">
        <FleetSchedule />
      </Card>
    </>
  );
}
