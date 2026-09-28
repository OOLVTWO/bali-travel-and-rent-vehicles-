"use client";

import { useState, useTransition } from "react";
import { updateBooking } from "@/app/admin/actions";
import { StatusChip } from "@/components/admin/ui";
import { Search } from "@/components/icons";
import type { BookingRow, UnitRow } from "@/lib/admin-data";
import { asKind, asStatus, bookingStatuses, channelLabel, kindLabel, statusLabel, statusLevel, type BookingStatus } from "@/lib/booking-meta";
import { formatRange, formatShort, isoFromTimestamp } from "@/lib/dates";
import { rupiah } from "@/lib/format";

const filters: (BookingStatus | "semua")[] = ["semua", ...bookingStatuses];

export function BookingsTable({ bookings, units }: { bookings: BookingRow[]; units: UnitRow[] }) {
  const [status, setStatus] = useState<BookingStatus | "semua">("semua");
  const [q, setQ] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const needle = q.trim().toLowerCase();
  const rows = bookings.filter(
    (b) =>
      (status === "semua" || asStatus(b.status) === status) &&
      (!needle || `${b.code} ${b.guest_name} ${b.item_title} ${b.location ?? ""} ${b.notes ?? ""}`.toLowerCase().includes(needle)),
  );
  const selectableUnits = units.filter((u) => u.status !== "nonaktif");

  function save(id: string, patch: { status?: string; unitId?: string | null }) {
    setError(null);
    setBusyId(id);
    startTransition(async () => {
      const res = await updateBooking(id, patch);
      if (!res.ok) setError(res.error);
      setBusyId(null);
    });
  }

  const select = "h-9 rounded-lg border border-line bg-white px-2 text-[13px] font-semibold disabled:opacity-60";

  return (
    <section className="flex flex-col gap-4 rounded-[18px] bg-white p-5 sm:p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1" role="group" aria-label="Filter status">
          {filters.map((f) => {
            const count = f === "semua" ? bookings.length : bookings.filter((b) => asStatus(b.status) === f).length;
            return (
              <button
                key={f}
                type="button"
                aria-pressed={status === f}
                onClick={() => setStatus(f)}
                className={`flex h-10 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-[13px] ${status === f ? "bg-ink font-bold text-white" : "border border-line font-semibold hover:bg-mist"}`}
              >
                {f === "semua" ? "Semua" : statusLabel[f]}
                <span className="tabular-nums opacity-70">{count}</span>
              </button>
            );
          })}
        </div>
        <label className="flex h-10 items-center gap-2 rounded-xl border border-line px-3 text-sm lg:w-72">
          <Search size={16} className="shrink-0 text-muted" />
          <span className="sr-only">Cari booking</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} type="search" placeholder="Kode, nama tamu, layanan…" className="w-full bg-transparent outline-none" />
        </label>
      </div>

      {error && <p role="alert" className="rounded-xl bg-bad-bg px-4 py-3 text-sm font-semibold text-bad">Gagal menyimpan: {error}</p>}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-[13px]">
          <thead>
            <tr className="text-left text-xs text-muted">
              <th className="py-2 font-bold">Kode</th>
              <th className="py-2 font-bold">Tamu</th>
              <th className="py-2 font-bold">Layanan</th>
              <th className="py-2 font-bold">Tanggal</th>
              <th className="py-2 text-right font-bold">Estimasi</th>
              <th className="py-2 pl-4 font-bold">Unit</th>
              <th className="py-2 pl-3 font-bold">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((b) => {
              const st = asStatus(b.status);
              const busy = busyId === b.id;
              return (
                <tr key={b.id} className={`border-t border-line-soft align-top ${busy ? "opacity-60" : ""}`}>
                  <td className="py-3 pr-3">
                    <span className="flex flex-col gap-0.5">
                      <span className="font-bold tabular-nums">{b.code}</span>
                      <span className="text-muted">{channelLabel[b.channel as keyof typeof channelLabel] ?? b.channel} · {formatShort(isoFromTimestamp(b.created_at))}</span>
                    </span>
                  </td>
                  <td className="py-3 pr-3">
                    <span className="flex flex-col gap-0.5">
                      <span className="font-semibold">{b.guest_name}</span>
                      {b.location && <span className="max-w-48 text-muted">{b.location}</span>}
                    </span>
                  </td>
                  <td className="py-3 pr-3">
                    <span className="flex max-w-72 flex-col gap-0.5">
                      <span>{b.item_title}{b.quantity > 1 ? ` · ${b.quantity}×` : ""}</span>
                      <span className="text-muted">{kindLabel[asKind(b.kind)]}</span>
                      {b.notes && <span className="text-muted italic">“{b.notes}”</span>}
                    </span>
                  </td>
                  <td className="py-3 pr-3 whitespace-nowrap">{formatRange(b.start_date, b.end_date)}</td>
                  <td className="py-3 text-right font-semibold whitespace-nowrap tabular-nums">{b.estimated_total ? rupiah(b.estimated_total) : "–"}</td>
                  <td className="py-3 pl-4">
                    <label className="sr-only" htmlFor={`unit-${b.id}`}>Unit untuk {b.code}</label>
                    <select id={`unit-${b.id}`} value={b.unit_id ?? ""} disabled={busy} onChange={(e) => save(b.id, { unitId: e.target.value || null })} className={`${select} max-w-52`}>
                      <option value="">— Belum ada unit —</option>
                      {selectableUnits.map((u) => (
                        <option key={u.id} value={u.id}>{u.vehicle_name} · {u.plate}{u.status === "servis" ? " (servis)" : ""}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 pl-3">
                    <span className="flex flex-col items-start gap-1.5">
                      <StatusChip level={statusLevel[st]}>{statusLabel[st]}</StatusChip>
                      <label className="sr-only" htmlFor={`status-${b.id}`}>Ubah status {b.code}</label>
                      <select id={`status-${b.id}`} value={st} disabled={busy} onChange={(e) => save(b.id, { status: e.target.value })} className={select}>
                        {bookingStatuses.map((s) => (
                          <option key={s} value={s}>{statusLabel[s]}</option>
                        ))}
                      </select>
                    </span>
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="py-10 text-center text-muted">
                  {bookings.length === 0 ? "Belum ada booking. Booking dari website otomatis masuk ke sini." : "Gak ada booking yang cocok."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
