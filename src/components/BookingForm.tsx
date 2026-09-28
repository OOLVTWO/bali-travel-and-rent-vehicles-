"use client";

import { useId, useState } from "react";
import { submitBooking } from "@/app/actions/booking";
import { bookingMessage, waLink } from "@/lib/whatsapp";
import { rupiah } from "@/lib/format";
import { WhatsApp } from "@/components/icons";

type Kind = "rental" | "driver" | "tour" | "combo";

type Props = {
  kind: Kind;
  title: string;
  /** Harga satuan: per hari (rental/driver), per orang (tour), per paket (combo) */
  unitPrice: number | null;
  defaults?: { from?: string; to?: string; area?: string };
  vehicleSlug?: string;
  tourSlug?: string;
};

function daysBetween(from: string, to: string) {
  if (!from || !to) return 1;
  const ms = new Date(to).getTime() - new Date(from).getTime();
  return Math.max(1, Math.round(ms / 86_400_000));
}

export function BookingForm({ kind, title, unitPrice, defaults, vehicleSlug, tourSlug }: Props) {
  const id = useId();
  const [from, setFrom] = useState(defaults?.from ?? "");
  const [to, setTo] = useState(defaults?.to ?? "");
  const [qty, setQty] = useState(kind === "tour" ? 2 : 1);
  const [place, setPlace] = useState(defaults?.area ?? "");
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [sending, setSending] = useState(false);
  const [savedCode, setSavedCode] = useState<string | null>(null);

  const multiDay = kind === "rental" || kind === "driver";
  const days = multiDay ? daysBetween(from, to) : 1;
  const total = unitPrice !== null ? unitPrice * qty * days : null;

  const qtyLabel = kind === "tour" || kind === "combo" ? "Travellers" : kind === "driver" ? "Cars" : "Vehicles";
  const placeLabel = kind === "tour" ? "Pick-up from (hotel or villa)" : kind === "combo" ? "Where are you staying?" : "Deliver to (hotel or villa)";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    // Buka tab dulu di dalam klik, biar gak diblokir popup blocker; URL WhatsApp diisi setelah booking tersimpan.
    const tab = window.open("about:blank", "_blank");
    let code: string | null = null;
    try {
      code = await submitBooking({
        kind,
        itemTitle: title,
        vehicleSlug,
        tourSlug,
        startDate: from || undefined,
        endDate: multiDay ? to || undefined : undefined,
        quantity: qty,
        guestName: name,
        location: place,
        notes,
        estimatedTotal: total,
      });
    } catch {
      code = null;
    }
    const fields: [string, string | number | undefined][] = code ? [["Booking code", code]] : [];
    if (multiDay) fields.push(["Pick-up date", from], ["Return date", to]);
    else fields.push([kind === "combo" ? "Arrival date" : "Date", from]);
    fields.push([qtyLabel, qty], [kind === "tour" ? "Pick-up" : "Location", place], ["Name", name], ["Notes", notes]);
    if (total !== null) fields.push(["Estimated total", rupiah(total)]);
    const url = waLink(bookingMessage(title, fields));
    if (tab) {
      tab.opener = null;
      tab.location.href = url;
    } else {
      window.location.href = url;
    }
    setSavedCode(code);
    setSending(false);
  }

  const field = "h-12 w-full rounded-xl border border-line bg-white px-3.5 text-[15px] text-ink placeholder:text-muted/70";
  const label = "flex flex-col gap-1.5 text-[13px] font-bold text-body";

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className={`grid gap-3 ${multiDay ? "grid-cols-2" : "grid-cols-1"}`}>
        <label className={label} htmlFor={`${id}-from`}>
          {multiDay ? "Pick-up date" : kind === "combo" ? "Arrival date" : "Date"}
          <input id={`${id}-from`} type="date" required value={from} onChange={(e) => setFrom(e.target.value)} className={field} />
        </label>
        {multiDay && (
          <label className={label} htmlFor={`${id}-to`}>
            Return date
            <input id={`${id}-to`} type="date" required min={from || undefined} value={to} onChange={(e) => setTo(e.target.value)} className={field} />
          </label>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <span id={`${id}-qty-label`} className="text-[13px] font-bold text-body">{qtyLabel}</span>
        <div className="flex items-center gap-3" role="group" aria-labelledby={`${id}-qty-label`}>
          <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label={`Fewer ${qtyLabel.toLowerCase()}`} className="h-11 w-11 rounded-xl border border-line text-xl font-bold">−</button>
          <output className="w-8 text-center text-lg font-bold tabular-nums" aria-live="polite">{qty}</output>
          <button type="button" onClick={() => setQty((q) => Math.min(20, q + 1))} aria-label={`More ${qtyLabel.toLowerCase()}`} className="h-11 w-11 rounded-xl border border-line text-xl font-bold">+</button>
        </div>
      </div>
      <label className={label} htmlFor={`${id}-place`}>
        {placeLabel}
        <input id={`${id}-place`} type="text" required value={place} onChange={(e) => setPlace(e.target.value)} placeholder="e.g. Villa Sayang, Canggu" className={field} />
      </label>
      <label className={label} htmlFor={`${id}-name`}>
        Your name
        <input id={`${id}-name`} type="text" required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={field} />
      </label>
      <label className={label} htmlFor={`${id}-notes`}>
        Notes (optional)
        <textarea id={`${id}-notes`} rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Flight time, child seat, surf rack…" className="w-full rounded-xl border border-line bg-white px-3.5 py-3 text-[15px] text-ink placeholder:text-muted/70" />
      </label>
      {total !== null && (
        <div className="flex items-baseline justify-between rounded-xl bg-mist px-4 py-3">
          <span className="text-sm text-body">
            Estimated total{multiDay ? ` · ${days} ${days === 1 ? "day" : "days"}` : ""}
          </span>
          <span className="text-xl font-bold tabular-nums">{rupiah(total)}</span>
        </div>
      )}
      <button type="submit" disabled={sending} className="flex h-13 items-center justify-center gap-2 rounded-xl bg-sun text-base font-bold text-ink hover:brightness-95 disabled:opacity-60">
        <WhatsApp size={20} />
        {sending ? "Sending…" : "Send booking on WhatsApp"}
      </button>
      {savedCode && (
        <p role="status" className="rounded-xl bg-sea-soft px-4 py-3 text-center text-sm font-semibold text-sea-dark">
          Booking saved as {savedCode}. Finish sending the message in WhatsApp.
        </p>
      )}
      <p className="text-center text-[13px] text-muted">We reply with availability and a payment link. Pay a small deposit, the rest at hand-over.</p>
    </form>
  );
}
