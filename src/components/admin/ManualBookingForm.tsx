"use client";

import { useRef, useState, useTransition } from "react";
import { createManualBooking } from "@/app/admin/actions";
import { Plus } from "@/components/icons";
import type { UnitRow } from "@/lib/admin-data";
import { bookingKinds, channelLabel, channels, kindLabel } from "@/lib/booking-meta";

/** Booking yang masuk lewat WhatsApp/IG/datang langsung, dicatat manual oleh admin. */
export function ManualBookingForm({ units, suggestions, defaultOpen = false }: { units: UnitRow[]; suggestions: string[]; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function submit(formData: FormData) {
    setError(null);
    setSaved(false);
    startTransition(async () => {
      const res = await createManualBooking(formData);
      if (res.ok) {
        formRef.current?.reset();
        setSaved(true);
      } else {
        setError(res.error);
      }
    });
  }

  const field = "h-11 w-full rounded-xl border border-line bg-white px-3 text-sm font-medium";
  const label = "flex flex-col gap-1.5 text-[13px] font-bold";

  return (
    <section id="booking-manual" className="flex flex-col gap-4 rounded-[18px] bg-white p-5 sm:p-6">
      <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="booking-manual-form" className="flex items-center justify-between gap-3 text-left">
        <span className="flex flex-col gap-0.5">
          <span className="text-[17px] font-bold">Catat booking manual</span>
          <span className="text-[13px] text-muted">Buat booking yang masuk lewat WhatsApp, Instagram atau tamu datang langsung</span>
        </span>
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sun text-ink transition-transform ${open ? "rotate-45" : ""}`}>
          <Plus size={20} />
        </span>
      </button>

      {open && (
        <form id="booking-manual-form" ref={formRef} action={submit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className={label}>
            Jenis layanan
            <select name="kind" required defaultValue="rental" className={field}>
              {bookingKinds.map((k) => <option key={k} value={k}>{kindLabel[k]}</option>)}
            </select>
          </label>
          <label className={label}>
            Sumber
            <select name="channel" defaultValue="whatsapp" className={field}>
              {channels.map((c) => <option key={c} value={c}>{channelLabel[c]}</option>)}
            </select>
          </label>
          <label className={`${label} sm:col-span-2`}>
            Nama tamu
            <input name="guest_name" required maxLength={120} className={field} placeholder="mis. Sophie M." />
          </label>
          <label className={`${label} sm:col-span-2`}>
            Layanan / paket
            <input name="item_title" required maxLength={200} list="booking-item-suggestions" className={field} placeholder="mis. Honda Scoopy · 3 hari" />
            <datalist id="booking-item-suggestions">
              {suggestions.map((s) => <option key={s} value={s} />)}
            </datalist>
          </label>
          <label className={label}>
            Mulai
            <input name="start_date" type="date" className={field} />
          </label>
          <label className={label}>
            Selesai
            <input name="end_date" type="date" className={field} />
          </label>
          <label className={label}>
            Jumlah (unit/orang)
            <input name="quantity" type="number" min={1} max={50} defaultValue={1} className={field} />
          </label>
          <label className={label}>
            Total (Rp)
            <input name="estimated_total" type="number" min={0} step={1000} className={field} placeholder="270000" />
          </label>
          <label className={`${label} sm:col-span-2`}>
            Unit
            <select name="unit_id" defaultValue="" className={field}>
              <option value="">— Pasang nanti —</option>
              {units.filter((u) => u.status !== "nonaktif").map((u) => (
                <option key={u.id} value={u.id}>{u.vehicle_name} · {u.plate}</option>
              ))}
            </select>
          </label>
          <label className={`${label} sm:col-span-2`}>
            Lokasi antar / jemput
            <input name="location" maxLength={300} className={field} placeholder="mis. Villa Kayu, Canggu" />
          </label>
          <label className={`${label} sm:col-span-2 lg:col-span-4`}>
            Catatan
            <textarea name="notes" maxLength={1000} rows={2} className="w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm font-medium" />
          </label>
          <div className="flex flex-wrap items-center gap-3 sm:col-span-2 lg:col-span-4">
            <button type="submit" disabled={pending} className="h-11 rounded-xl bg-sun px-5 text-sm font-bold text-ink disabled:opacity-60">
              {pending ? "Menyimpan…" : "Simpan booking"}
            </button>
            {error && <p role="alert" className="text-sm font-semibold text-bad">{error}</p>}
            {saved && <p role="status" className="text-sm font-semibold text-sea-dark">Booking tersimpan dengan status Dikonfirmasi.</p>}
          </div>
        </form>
      )}
    </section>
  );
}
