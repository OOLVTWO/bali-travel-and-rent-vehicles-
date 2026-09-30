"use client";

import { useId, useRef, useState, useTransition } from "react";
import { deleteReview, reorderReviews, saveGoogleRating, saveReview, setReviewPublished, type ReviewInput } from "@/app/admin/actions";
import { Toggle } from "@/components/admin/Toggle";
import { Card, StatusChip } from "@/components/admin/ui";
import { Stars } from "@/components/cards";
import { ChevronDown, ChevronUp, Trash } from "@/components/icons";
import { formatShort } from "@/lib/dates";
import { reviewSourceLabel, reviewSources, sourceLabel } from "@/lib/reviews";
import type { Tables } from "@/lib/supabase/database.types";

type ReviewRow = Tables<"reviews">;
type Settings = { google_rating: number | null; google_review_count: number | null; google_reviews_url: string | null };

const field = "h-11 w-full rounded-xl border border-line bg-white px-3 text-sm font-medium";
const label = "flex flex-col gap-1.5 text-[13px] font-bold";
const SHOWN_ON_HOME = 6;

const empty: ReviewInput = { guestName: "", country: "", rating: 5, quote: "", source: "google", service: "", reviewDate: "", published: true };

// ---------------------------------------------------------------------------
// Rating Google (tampil di header homepage)
// ---------------------------------------------------------------------------

export function GoogleRatingForm({ settings }: { settings: Settings }) {
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(formData: FormData) {
    setMsg(null);
    startTransition(async () => {
      const res = await saveGoogleRating(formData);
      setMsg(res.ok ? { ok: true, text: "Tersimpan & langsung tampil di website." } : { ok: false, text: res.error });
    });
  }

  return (
    <Card title="Rating Google" subtitle="Tampil di header homepage & di atas ulasan. Kosongkan rating kalau belum punya ulasan Google.">
      <form action={submit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[140px_180px_1fr_auto] lg:items-end">
        <label className={label}>
          Rating (1–5)
          <input name="google_rating" inputMode="decimal" defaultValue={settings.google_rating ?? ""} placeholder="4.9" className={field} />
        </label>
        <label className={label}>
          Jumlah ulasan
          <input name="google_review_count" inputMode="numeric" defaultValue={settings.google_review_count ?? ""} placeholder="128" className={field} />
        </label>
        <label className={`${label} sm:col-span-2 lg:col-span-1`}>
          Link ke ulasan Google
          <input name="google_reviews_url" type="url" defaultValue={settings.google_reviews_url ?? ""} placeholder="https://g.page/r/…/review" className={field} />
        </label>
        <button type="submit" disabled={pending} className="h-11 rounded-xl bg-ink px-5 text-sm font-bold text-white disabled:opacity-60">
          {pending ? "Menyimpan…" : "Simpan"}
        </button>
        {msg && <p role={msg.ok ? "status" : "alert"} className={`text-sm font-semibold sm:col-span-2 lg:col-span-4 ${msg.ok ? "text-sea-dark" : "text-bad"}`}>{msg.text}</p>}
      </form>
      <p className="text-xs text-muted">
        Cara dapet link: buka Google Business Profile → &ldquo;Minta ulasan&rdquo; / &ldquo;Get more reviews&rdquo; → salin link-nya. Angka rating & jumlah ulasan diupdate manual di sini.
      </p>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Tambah / edit ulasan + daftar
// ---------------------------------------------------------------------------

export function ReviewsManager({ reviews, services }: { reviews: ReviewRow[]; services: string[] }) {
  const id = useId();
  const formRef = useRef<HTMLElement>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<ReviewInput>(empty);
  const [formMsg, setFormMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [listError, setListError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [saving, startSave] = useTransition();
  const [, startList] = useTransition();

  const set = <K extends keyof ReviewInput>(k: K, v: ReviewInput[K]) => setForm((f) => ({ ...f, [k]: v }));
  const publishedIds = reviews.filter((r) => r.published).map((r) => r.id);

  function startEdit(r: ReviewRow) {
    setEditing(r.id);
    setFormMsg(null);
    setForm({
      guestName: r.guest_name,
      country: r.country ?? "",
      rating: r.rating,
      quote: r.quote,
      source: r.source,
      service: r.service ?? "",
      reviewDate: r.review_date ?? "",
      published: r.published,
    });
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function cancelEdit() {
    setEditing(null);
    setForm(empty);
    setFormMsg(null);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setFormMsg(null);
    startSave(async () => {
      const res = await saveReview(editing, form);
      if (!res.ok) {
        setFormMsg({ ok: false, text: res.error });
        return;
      }
      setFormMsg({ ok: true, text: editing ? "Perubahan tersimpan." : "Ulasan ditambahkan di urutan paling atas." });
      setEditing(null);
      setForm(empty);
    });
  }

  function run(rowId: string, fn: () => Promise<{ ok: boolean; error?: string }>) {
    setListError(null);
    setBusyId(rowId);
    startList(async () => {
      const res = await fn();
      if (!res.ok) setListError(res.error ?? "Gagal menyimpan.");
      setBusyId(null);
    });
  }

  function move(index: number, dir: -1 | 1) {
    const j = index + dir;
    if (j < 0 || j >= reviews.length) return;
    const ids = reviews.map((r) => r.id);
    [ids[index], ids[j]] = [ids[j], ids[index]];
    run(reviews[index].id, () => reorderReviews(ids));
  }

  return (
    <>
      <section ref={formRef} className="scroll-mt-6">
        <Card
          title={editing ? "Edit ulasan" : "Tambah ulasan"}
          subtitle="Salin ulasan asli dari Google, Tripadvisor atau chat tamu (minta izin dulu kalau dari chat). Jangan bikin ulasan palsu: melanggar aturan Google & bisa bikin tamu gak percaya."
        >
          <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <label className={label}>
              Nama tamu
              <input value={form.guestName} onChange={(e) => set("guestName", e.target.value)} required maxLength={80} placeholder="Sophie M." className={field} />
            </label>
            <label className={label}>
              Negara
              <input value={form.country} onChange={(e) => set("country", e.target.value)} maxLength={60} placeholder="Australia" className={field} />
            </label>
            <label className={label}>
              Rating
              <select value={form.rating} onChange={(e) => set("rating", Number(e.target.value))} className={field}>
                {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{"★".repeat(n)} ({n})</option>)}
              </select>
            </label>
            <label className={label}>
              Sumber
              <select value={form.source} onChange={(e) => set("source", e.target.value)} className={field}>
                {reviewSources.map((s) => <option key={s} value={s}>{reviewSourceLabel[s]}</option>)}
              </select>
            </label>
            <label className={`${label} sm:col-span-2`}>
              Layanan yang dipakai (opsional)
              <input value={form.service} onChange={(e) => set("service", e.target.value)} maxLength={120} list={`${id}-services`} placeholder="Nusa Penida tour" className={field} />
              <datalist id={`${id}-services`}>
                {services.map((s) => <option key={s} value={s} />)}
              </datalist>
            </label>
            <label className={label}>
              Tanggal ulasan (opsional)
              <input type="date" value={form.reviewDate} onChange={(e) => set("reviewDate", e.target.value)} className={field} />
            </label>
            <div className="flex items-end">
              <Toggle label="Tampil di website" checked={form.published} onChange={(v) => set("published", v)} />
            </div>
            <label className={`${label} sm:col-span-2 lg:col-span-4`}>
              <span className="flex justify-between gap-3">
                Isi ulasan
                <span className={`font-semibold tabular-nums ${form.quote.length > 600 ? "text-bad" : "text-muted"}`}>{form.quote.length} / 600</span>
              </span>
              <textarea value={form.quote} onChange={(e) => set("quote", e.target.value)} required rows={3} placeholder="The scooter was delivered to our villa in 20 minutes…" className="w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm font-medium" />
            </label>
            <div className="flex flex-wrap items-center gap-3 sm:col-span-2 lg:col-span-4">
              <button type="submit" disabled={saving} className="h-11 rounded-xl bg-sun px-5 text-sm font-bold text-ink disabled:opacity-60">
                {saving ? "Menyimpan…" : editing ? "Simpan perubahan" : "Tambah ulasan"}
              </button>
              {editing && <button type="button" onClick={cancelEdit} className="h-11 rounded-xl border border-line px-4 text-sm font-bold">Batal</button>}
              {formMsg && <p role={formMsg.ok ? "status" : "alert"} className={`text-sm font-semibold ${formMsg.ok ? "text-sea-dark" : "text-bad"}`}>{formMsg.text}</p>}
            </div>
          </form>
        </Card>
      </section>

      <Card
        title="Semua ulasan"
        subtitle={`Homepage menampilkan ${SHOWN_ON_HOME} ulasan teratas yang aktif. Pakai panah buat atur urutan.`}
      >
        {listError && <p role="alert" className="rounded-xl bg-bad-bg px-4 py-3 text-sm font-semibold text-bad">Gagal: {listError}</p>}
        {reviews.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted">Belum ada ulasan. Tambahin ulasan pertama lewat form di atas. Selama kosong, bagian ulasan di website disembunyikan.</p>
        ) : (
          <ul className="flex flex-col">
            {reviews.map((r, i) => {
              const onHome = r.published && publishedIds.indexOf(r.id) < SHOWN_ON_HOME;
              const busy = busyId === r.id;
              return (
                <li key={r.id} className={`flex flex-col gap-3 border-t border-line-soft py-4 first:border-t-0 first:pt-0 sm:flex-row sm:items-start ${busy ? "opacity-60" : ""}`}>
                  <div className="flex shrink-0 gap-1 sm:flex-col">
                    <button type="button" onClick={() => move(i, -1)} disabled={i === 0 || busy} aria-label={`Naikkan ulasan ${r.guest_name}`} className="flex h-9 w-9 items-center justify-center rounded-lg border border-line disabled:opacity-30">
                      <ChevronUp size={16} />
                    </button>
                    <button type="button" onClick={() => move(i, 1)} disabled={i === reviews.length - 1 || busy} aria-label={`Turunkan ulasan ${r.guest_name}`} className="flex h-9 w-9 items-center justify-center rounded-lg border border-line disabled:opacity-30">
                      <ChevronDown size={16} />
                    </button>
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <span className="flex flex-wrap items-center gap-2">
                      <Stars rating={r.rating} className="text-[#f5a524]" />
                      <span className="sr-only">{r.rating} dari 5</span>
                      {onHome ? <StatusChip level="good">Tampil di homepage</StatusChip> : r.published ? <StatusChip level="info">Aktif</StatusChip> : <StatusChip level="neutral">Disembunyikan</StatusChip>}
                    </span>
                    <p className="text-sm leading-relaxed">&ldquo;{r.quote}&rdquo;</p>
                    <span className="text-[13px] text-muted">
                      <strong className="text-ink">{r.guest_name}</strong>
                      {[r.country, r.service, sourceLabel(r.source), r.review_date ? formatShort(r.review_date) : null].filter(Boolean).map((x) => ` · ${x}`)}
                    </span>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    <button type="button" onClick={() => startEdit(r)} disabled={busy} className="h-9 rounded-lg border border-line px-3 text-[13px] font-bold">Edit</button>
                    <button type="button" onClick={() => run(r.id, () => setReviewPublished(r.id, !r.published))} disabled={busy} className="h-9 rounded-lg border border-line px-3 text-[13px] font-bold">
                      {r.published ? "Sembunyikan" : "Tampilkan"}
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      aria-label={`Hapus ulasan ${r.guest_name}`}
                      onClick={() => {
                        if (window.confirm(`Hapus ulasan dari ${r.guest_name}?`)) run(r.id, () => deleteReview(r.id));
                      }}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-muted hover:text-bad"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </>
  );
}
