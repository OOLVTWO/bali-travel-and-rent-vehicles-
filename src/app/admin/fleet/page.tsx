import type { Metadata } from "next";
import { fleetUnits } from "@/data/admin";
import { Card, PageTitle, StatusChip, type Level } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Armada" };

const level: Record<string, Level> = { Tersedia: "good", Disewa: "info", Tour: "warn", Servis: "neutral" };

export default function FleetPage() {
  const idr = new Intl.NumberFormat("id-ID");
  return (
    <>
      <PageTitle title="Armada" subtitle={`${fleetUnits.length} unit terdaftar (contoh)`} />
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-[13px]">
            <thead>
              <tr className="text-left text-xs text-muted">
                <th className="py-2 font-bold">Plat</th>
                <th className="py-2 font-bold">Model</th>
                <th className="py-2 font-bold">Jenis</th>
                <th className="py-2 text-right font-bold">Kilometer</th>
                <th className="py-2 pl-4 font-bold">Servis berikutnya</th>
                <th className="py-2 font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {fleetUnits.map((u) => (
                <tr key={u.plate} className="border-t border-line-soft">
                  <td className="py-3 font-bold">{u.plate}</td>
                  <td className="py-3">{u.model}</td>
                  <td className="py-3">{u.kind}</td>
                  <td className="py-3 text-right tabular-nums">{idr.format(u.km)} km</td>
                  <td className="py-3 pl-4">{u.nextService}</td>
                  <td className="py-3"><StatusChip level={level[u.status] ?? "neutral"}>{u.status}</StatusChip></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
