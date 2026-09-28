"use client";

import { useState } from "react";
import { bookings, bookingStatusLabel, type BookingStatus } from "@/data/admin";
import { StatusChip, type Level } from "@/components/admin/ui";
import { rupiah } from "@/lib/format";
import { Search } from "@/components/icons";

const statusLevel: Record<BookingStatus, Level> = {
  "menunggu-dp": "warn",
  konfirmasi: "bad",
  dikonfirmasi: "info",
  berjalan: "good",
  selesai: "neutral",
  batal: "neutral",
};

const filters: (BookingStatus | "semua")[] = ["semua", "konfirmasi", "menunggu-dp", "dikonfirmasi", "berjalan", "selesai", "batal"];

export function BookingsTable() {
  const [status, setStatus] = useState<BookingStatus | "semua">("semua");
  const [q, setQ] = useState("");
  const needle = q.trim().toLowerCase();
  const rows = bookings.filter(
    (b) =>
      (status === "semua" || b.status === status) &&
      (!needle || `${b.code} ${b.guest} ${b.item} ${b.country}`.toLowerCase().includes(needle)),
  );

  return (
    <section className="flex flex-col gap-4 rounded-[18px] bg-white p-5 sm:p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1" role="group" aria-label="Filter status">
          {filters.map((f) => {
            const count = f === "semua" ? bookings.length : bookings.filter((b) => b.status === f).length;
            return (
              <button
                key={f}
                type="button"
                aria-pressed={status === f}
                onClick={() => setStatus(f)}
                className={`flex h-10 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-[13px] ${status === f ? "bg-ink font-bold text-white" : "border border-line font-semibold hover:bg-mist"}`}
              >
                {f === "semua" ? "Semua" : bookingStatusLabel[f]}
                <span className="tabular-nums opacity-70">{count}</span>
              </button>
            );
          })}
        </div>
        <label className="flex h-10 items-center gap-2 rounded-xl border border-line px-3 text-sm lg:w-72">
          <Search size={16} className="shrink-0 text-muted" />
          <span className="sr-only">Cari booking</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} type="search" placeholder="Kode, nama tamu, paket…" className="w-full bg-transparent outline-none" />
        </label>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-[13px]">
          <thead>
            <tr className="text-left text-xs text-muted">
              <th className="py-2 font-bold">Kode</th>
              <th className="py-2 font-bold">Tamu</th>
              <th className="py-2 font-bold">Layanan</th>
              <th className="py-2 font-bold">Tanggal</th>
              <th className="py-2 font-bold">Sumber</th>
              <th className="py-2 text-right font-bold">Total</th>
              <th className="py-2 pl-4 font-bold">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((b) => (
              <tr key={b.code} className="border-t border-line-soft">
                <td className="py-3 font-bold tabular-nums">{b.code}</td>
                <td className="py-3"><span className="flex flex-col"><span className="font-semibold">{b.guest}</span><span className="text-muted">{b.country}</span></span></td>
                <td className="py-3"><span className="flex flex-col"><span>{b.item}</span><span className="text-muted">{b.kind}</span></span></td>
                <td className="py-3">{b.dates}</td>
                <td className="py-3">{b.channel}</td>
                <td className="py-3 text-right font-semibold tabular-nums">{rupiah(b.total)}</td>
                <td className="py-3 pl-4"><StatusChip level={statusLevel[b.status]}>{bookingStatusLabel[b.status]}</StatusChip></td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={7} className="py-10 text-center text-muted">Gak ada booking yang cocok.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
