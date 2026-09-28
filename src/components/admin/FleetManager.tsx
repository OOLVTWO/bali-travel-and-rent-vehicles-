"use client";

import { useRef, useState, useTransition } from "react";
import { createUnit, deleteUnit, updateUnit, updateVehicle } from "@/app/admin/actions";
import { Toggle } from "@/components/admin/Toggle";
import { Card, StatusChip, type Level } from "@/components/admin/ui";
import { Trash } from "@/components/icons";
import type { UnitRow } from "@/lib/admin-data";
import { formatShort, todayWita, addDays } from "@/lib/dates";
import { unitStatuses, unitStatusLabel } from "@/lib/booking-meta";

export type VehicleOption = { id: string; name: string; category: string; active: boolean; pricePerDay: number | null; priceWithDriver: number | null };

const field = "h-10 w-full rounded-lg border border-line bg-white px-2.5 text-[13px] font-semibold disabled:opacity-60";
const unitLevel: Record<string, Level> = { tersedia: "good", servis: "neutral", nonaktif: "warn" };

function toNumber(v: string) {
  const n = Number(v.replace(/\D/g, ""));
  return v.trim() === "" || !Number.isFinite(n) ? null : n;
}

// ---------------------------------------------------------------------------
// Model & harga
// ---------------------------------------------------------------------------

function VehicleRow({ v }: { v: VehicleOption }) {
  const [day, setDay] = useState(v.pricePerDay?.toString() ?? "");
  const [driver, setDriver] = useState(v.priceWithDriver?.toString() ?? "");
  const [active, setActive] = useState(v.active);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const dirty = day !== (v.pricePerDay?.toString() ?? "") || driver !== (v.priceWithDriver?.toString() ?? "") || active !== v.active;

  function save() {
    setMsg(null);
    startTransition(async () => {
      const res = await updateVehicle(v.id, { pricePerDay: toNumber(day), priceWithDriver: toNumber(driver), active });
      setMsg(res.ok ? { ok: true, text: "Tersimpan" } : { ok: false, text: res.error });
    });
  }

  return (
    <li className="grid gap-3 border-t border-line-soft py-4 first:border-t-0 first:pt-0 sm:grid-cols-[1fr_150px_150px] lg:grid-cols-[1.2fr_160px_160px_170px_auto] lg:items-end">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-bold">{v.name}</span>
        <span className="text-[13px] text-muted">{v.category === "car" ? "Mobil" : "Motor"}</span>
      </div>
      <label className="flex flex-col gap-1 text-xs font-bold text-muted">
        Lepas kunci / hari
        <input inputMode="numeric" value={day} onChange={(e) => setDay(e.target.value)} placeholder="Gak tersedia" className={field} />
      </label>
      <label className="flex flex-col gap-1 text-xs font-bold text-muted">
        Dengan driver / hari
        <input inputMode="numeric" value={driver} onChange={(e) => setDriver(e.target.value)} placeholder="Gak tersedia" className={field} />
      </label>
      <div className="sm:col-span-2 lg:col-span-1">
        <Toggle label="Tampil di website" checked={active} onChange={setActive} />
      </div>
      <div className="flex items-center gap-3">
        <button type="button" onClick={save} disabled={!dirty || pending} className="h-10 rounded-lg bg-ink px-4 text-[13px] font-bold text-white disabled:opacity-40">
          {pending ? "Menyimpan…" : "Simpan"}
        </button>
        {msg && <span role={msg.ok ? "status" : "alert"} className={`text-[13px] font-semibold ${msg.ok ? "text-sea-dark" : "text-bad"}`}>{msg.text}</span>}
      </div>
    </li>
  );
}

export function VehiclePricing({ vehicles }: { vehicles: VehicleOption[] }) {
  return (
    <Card title="Model & harga" subtitle="Harga dalam Rupiah. Kosongkan kalau layanan itu gak tersedia. Model yang dimatikan gak muncul di website.">
      <ul className="flex flex-col">
        {vehicles.map((v) => <VehicleRow key={`${v.id}-${v.pricePerDay}-${v.priceWithDriver}-${v.active}`} v={v} />)}
      </ul>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Unit / plat nomor
// ---------------------------------------------------------------------------

function UnitRowEditor({ u }: { u: UnitRow }) {
  const [km, setKm] = useState(String(u.km));
  const [next, setNext] = useState(u.next_service ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const dirty = km !== String(u.km) || next !== (u.next_service ?? "");
  const today = todayWita();
  const serviceDue = u.next_service && u.next_service <= addDays(today, 7);

  function run(fn: () => Promise<{ ok: boolean; error?: string }>) {
    setError(null);
    startTransition(async () => {
      const res = await fn();
      if (!res.ok) setError(res.error ?? "Gagal menyimpan.");
    });
  }

  return (
    <tr className={`border-t border-line-soft ${pending ? "opacity-60" : ""}`}>
      <td className="py-3 pr-3 font-bold whitespace-nowrap">{u.plate}</td>
      <td className="py-3 pr-3">{u.vehicle_name}</td>
      <td className="py-3 pr-3">
        <label className="sr-only" htmlFor={`st-${u.id}`}>Status {u.plate}</label>
        <span className="flex items-center gap-2">
          <select id={`st-${u.id}`} value={u.status} disabled={pending} onChange={(e) => run(() => updateUnit(u.id, { status: e.target.value }))} className={`${field} w-32`}>
            {unitStatuses.map((s) => <option key={s} value={s}>{unitStatusLabel[s]}</option>)}
          </select>
          <span className="hidden xl:inline"><StatusChip level={unitLevel[u.status] ?? "neutral"}>{unitStatusLabel[u.status as keyof typeof unitStatusLabel] ?? u.status}</StatusChip></span>
        </span>
      </td>
      <td className="py-3 pr-3">
        <label className="sr-only" htmlFor={`km-${u.id}`}>Kilometer {u.plate}</label>
        <input id={`km-${u.id}`} inputMode="numeric" value={km} onChange={(e) => setKm(e.target.value.replace(/\D/g, ""))} className={`${field} w-28 text-right tabular-nums`} />
      </td>
      <td className="py-3 pr-3">
        <label className="sr-only" htmlFor={`ns-${u.id}`}>Servis berikutnya {u.plate}</label>
        <span className="flex flex-col gap-1">
          <input id={`ns-${u.id}`} type="date" value={next} onChange={(e) => setNext(e.target.value)} className={`${field} w-40`} />
          {serviceDue && !dirty && <span className="text-xs font-bold text-warn">Jatuh tempo {formatShort(u.next_service)}</span>}
        </span>
      </td>
      <td className="py-3">
        <span className="flex items-center justify-end gap-2">
          {error && <span role="alert" className="max-w-40 text-xs font-semibold text-bad">{error}</span>}
          <button
            type="button"
            disabled={!dirty || pending}
            onClick={() => run(() => updateUnit(u.id, { km: Number(km || 0), nextService: next || null }))}
            className="h-10 rounded-lg bg-ink px-3.5 text-[13px] font-bold text-white disabled:opacity-40"
          >
            Simpan
          </button>
          <button
            type="button"
            disabled={pending}
            aria-label={`Hapus unit ${u.plate}`}
            onClick={() => {
              if (window.confirm(`Hapus unit ${u.plate}? Booking yang pakai unit ini jadi "belum ada unit".`)) run(() => deleteUnit(u.id));
            }}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-line text-muted hover:text-bad disabled:opacity-40"
          >
            <Trash size={16} />
          </button>
        </span>
      </td>
    </tr>
  );
}

export function UnitsManager({ units, vehicles }: { units: UnitRow[]; vehicles: VehicleOption[] }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function add(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const res = await createUnit(formData);
      if (res.ok) formRef.current?.reset();
      else setError(res.error);
    });
  }

  return (
    <Card title="Unit & plat nomor" subtitle="Setiap motor/mobil fisik. Unit dipasang ke booking di menu Booking, lalu muncul di kalender.">
      <form ref={formRef} action={add} className="grid gap-3 rounded-xl bg-mist p-4 sm:grid-cols-2 lg:grid-cols-[1fr_1.3fr_130px_170px_auto] lg:items-end">
        <label className="flex flex-col gap-1 text-xs font-bold text-muted">
          Plat nomor
          <input name="plate" required maxLength={20} placeholder="DK 1234 AB" className={`${field} uppercase`} />
        </label>
        <label className="flex flex-col gap-1 text-xs font-bold text-muted">
          Model
          <select name="vehicle_id" required defaultValue="" className={field}>
            <option value="" disabled>Pilih model…</option>
            {vehicles.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-bold text-muted">
          Kilometer
          <input name="km" inputMode="numeric" pattern="[0-9]*" placeholder="0" className={field} />
        </label>
        <label className="flex flex-col gap-1 text-xs font-bold text-muted">
          Servis berikutnya
          <input name="next_service" type="date" className={field} />
        </label>
        <button type="submit" disabled={pending} className="h-10 rounded-lg bg-sun px-4 text-[13px] font-bold text-ink disabled:opacity-60">
          {pending ? "Menambah…" : "Tambah unit"}
        </button>
        {error && <p role="alert" className="text-[13px] font-semibold text-bad sm:col-span-2 lg:col-span-5">{error}</p>}
      </form>

      {units.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted">Belum ada unit. Tambah plat nomor pertama lewat form di atas.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-[13px]">
            <thead>
              <tr className="text-left text-xs text-muted">
                <th className="py-2 font-bold">Plat</th>
                <th className="py-2 font-bold">Model</th>
                <th className="py-2 font-bold">Status</th>
                <th className="py-2 font-bold">Kilometer</th>
                <th className="py-2 font-bold">Servis berikutnya</th>
                <th className="py-2"><span className="sr-only">Aksi</span></th>
              </tr>
            </thead>
            <tbody>
              {units.map((u) => <UnitRowEditor key={`${u.id}-${u.updated_at}`} u={u} />)}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
