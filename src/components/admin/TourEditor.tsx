"use client";

import Link from "next/link";
import { useId, useState, useTransition } from "react";
import { saveTour } from "@/app/admin/actions";
import { GalleryManager, uploadPending, type GalleryPhoto } from "@/components/admin/GalleryManager";
import { Toggle } from "@/components/admin/Toggle";
import { Card } from "@/components/admin/ui";
import { Photo } from "@/components/Photo";
import { Alert, CheckCircle, Eye } from "@/components/icons";
import { removeUploaded } from "@/lib/upload";
import { rupiah } from "@/lib/format";

type Tab = "info" | "foto" | "harga";

export type TourEditorData = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  summaryId: string;
  duration: string;
  priceFrom: number;
  active: boolean;
  featured: boolean;
  bestSeller: boolean;
  itinerary: { time: string; title: string }[];
  photos: GalleryPhoto[];
};

export function TourEditor({ tour }: { tour: TourEditorData }) {
  const id = useId();
  const [tab, setTab] = useState<Tab>("foto");
  const [title, setTitle] = useState(tour.title);
  const [summary, setSummary] = useState(tour.summary);
  const [summaryId, setSummaryId] = useState(tour.summaryId);
  const [duration, setDuration] = useState(tour.duration);
  const [price, setPrice] = useState(String(tour.priceFrom));
  const [photos, setPhotos] = useState<GalleryPhoto[]>(tour.photos);
  const [active, setActive] = useState(tour.active);
  const [onHome, setOnHome] = useState(tour.featured);
  const [bestSeller, setBestSeller] = useState(tour.bestSeller);
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const priceNum = Number(price);
  const checks = [
    { ok: photos.length >= 6, label: `Minimal 6 foto (ada ${photos.length})`, todo: `Tambah ${6 - photos.length} foto lagi (minimal 6)` },
    { ok: photos.length > 0 && photos[0].alt.trim().length > 0, label: "Foto cover punya keterangan", todo: "Isi keterangan (alt text) foto cover" },
    { ok: priceNum > 0 && duration.trim().length > 0, label: "Harga & durasi terisi", todo: "Isi harga & durasi" },
    { ok: summaryId.trim().length > 20, label: "Deskripsi Bahasa Indonesia terisi", todo: "Isi deskripsi Bahasa Indonesia" },
  ];
  const done = checks.filter((c) => c.ok).length;
  const cover = photos[0];

  function save() {
    setStatus(null);
    startTransition(async () => {
      const up = await uploadPending(photos, `tours/${tour.id}`, (done, total) => {
        if (total) setStatus({ ok: true, text: `Upload foto ${done}/${total}…` });
      });
      if (!up.ok) {
        await removeUploaded(up.uploaded);
        setStatus({ ok: false, text: up.error });
        return;
      }
      const res = await saveTour(
        tour.id,
        { title, summary, summaryId, duration, priceFrom: priceNum, active, featured: onHome, bestSeller },
        up.photos,
      );
      if (!res.ok) {
        await removeUploaded(up.uploaded);
        setStatus({ ok: false, text: res.error });
        return;
      }
      for (const p of photos) if (p.file) URL.revokeObjectURL(p.src);
      setPhotos(up.photos.map((p, i) => ({ id: `${p.url}-${i}`, src: p.url, alt: p.alt, position: p.position ?? undefined, storagePath: p.storagePath })));
      setStatus({ ok: true, text: active ? "Tersimpan & tampil di website." : "Tersimpan. Paket masih nonaktif, belum tampil di website." });
    });
  }

  const tabBtn = (t: Tab, label: string) => (
    <button
      type="button"
      role="tab"
      aria-selected={tab === t}
      aria-controls={`${id}-panel`}
      id={`${id}-tab-${t}`}
      onClick={() => setTab(t)}
      className={`h-11 shrink-0 border-b-[3px] px-3.5 text-sm ${tab === t ? "border-sea font-bold text-ink" : "border-transparent font-semibold text-muted hover:text-ink"}`}
    >
      {label}
    </button>
  );

  const field = "h-11 w-full rounded-lg border border-line bg-white px-3 text-sm";

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="font-display text-[28px] font-semibold sm:text-[30px]">Edit paket tour</h1>
        <div className="flex flex-wrap gap-2.5">
          <Link href={`/tours/${tour.slug}`} target="_blank" className="flex h-11 items-center gap-2 rounded-xl border border-line bg-white px-4 text-sm font-bold">
            <Eye size={18} /> Lihat di website
          </Link>
          <button type="button" onClick={save} disabled={pending} className="h-11 rounded-xl bg-sun px-4.5 text-sm font-bold text-ink disabled:opacity-60">
            {pending ? "Menyimpan…" : "Simpan perubahan"}
          </button>
        </div>
      </div>
      {status &&
        (status.ok ? (
          <p role="status" className="flex items-center gap-2 rounded-xl bg-sea-soft px-4 py-3 text-sm font-semibold text-sea-dark">
            <CheckCircle size={18} /> {status.text}
          </p>
        ) : (
          <p role="alert" className="flex items-center gap-2 rounded-xl bg-bad-bg px-4 py-3 text-sm font-semibold text-bad">
            <Alert size={18} /> Gagal menyimpan: {status.text}
          </p>
        ))}

      <div role="tablist" aria-label="Bagian" className="flex gap-1 overflow-x-auto border-b border-line">
        {tabBtn("info", "Info dasar")}
        {tabBtn("foto", "Foto & galeri")}
        {tabBtn("harga", "Harga & jadwal")}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${tab}`} className="flex min-w-0 flex-col gap-5">
          {tab === "foto" && (
            <>
              <Card title="Foto cover" subtitle="Jadi header halaman tour dan kartu di homepage" action={<span className="text-xs text-muted">Min. 2400 × 1350 px · landscape</span>}>
                <div className="relative h-64 overflow-hidden rounded-xl sm:h-72">
                  {cover ? (
                    cover.file ? (
                      // eslint-disable-next-line @next/next/no-img-element -- pratinjau file lokal (blob URL)
                      <img src={cover.src} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <Photo src={cover.src} alt="" fill sizes="(min-width: 1280px) 60vw, 100vw" position={cover.position} />
                    )
                  ) : (
                    <span className="flex h-full items-center justify-center bg-mist text-sm text-muted">Belum ada foto. Tambahin di galeri di bawah.</span>
                  )}
                </div>
                <p className="text-[13px] text-muted">Foto cover = foto pertama di galeri. Pakai tombol &ldquo;Jadikan cover&rdquo; buat ganti.</p>
              </Card>
              <Card title="Galeri" subtitle="Pilih foto buat geser urutan, hapus, atau isi keterangan. Jangan lupa klik Simpan perubahan.">
                <GalleryManager photos={photos} onChange={setPhotos} />
              </Card>
            </>
          )}
          {tab === "info" && (
            <Card title="Info dasar">
              <div className="grid gap-4">
                <label className="flex flex-col gap-1.5 text-[13px] font-bold" htmlFor={`${id}-title`}>
                  Nama paket
                  <input id={`${id}-title`} value={title} onChange={(e) => setTitle(e.target.value)} className={field} />
                </label>
                <label className="flex flex-col gap-1.5 text-[13px] font-bold" htmlFor={`${id}-sum`}>
                  Deskripsi singkat (English)
                  <textarea id={`${id}-sum`} rows={4} value={summary} onChange={(e) => setSummary(e.target.value)} className="rounded-lg border border-line px-3 py-2.5 text-sm font-medium" />
                </label>
                <label className="flex flex-col gap-1.5 text-[13px] font-bold" htmlFor={`${id}-sum-id`}>
                  Deskripsi singkat (Bahasa Indonesia)
                  <textarea id={`${id}-sum-id`} rows={4} value={summaryId} onChange={(e) => setSummaryId(e.target.value)} placeholder="Buat tamu domestik…" className="rounded-lg border border-line px-3 py-2.5 text-sm font-medium" />
                </label>
              </div>
            </Card>
          )}
          {tab === "harga" && (
            <Card title="Harga & jadwal">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5 text-[13px] font-bold" htmlFor={`${id}-price`}>
                  Harga mulai (per orang, Rp)
                  <input id={`${id}-price`} inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value.replace(/\D/g, ""))} className={field} />
                </label>
                <label className="flex flex-col gap-1.5 text-[13px] font-bold" htmlFor={`${id}-dur`}>
                  Durasi
                  <input id={`${id}-dur`} value={duration} onChange={(e) => setDuration(e.target.value)} className={field} />
                </label>
              </div>
              {tour.itinerary.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="text-[13px] font-bold">Itinerary</span>
                  <ol className="flex flex-col gap-2 text-sm">
                    {tour.itinerary.map((s, i) => (
                      <li key={i} className="flex gap-3 rounded-lg bg-mist px-3 py-2"><span className="w-12 font-bold tabular-nums text-sea">{s.time}</span>{s.title}</li>
                    ))}
                  </ol>
                  <span className="text-xs text-muted">Mau ubah itinerary? Kabari developer dulu, editornya nyusul.</span>
                </div>
              )}
            </Card>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <Card title="Tampil di website">
            <div className="flex flex-col">
              <Toggle label="Aktif & bisa dibooking" checked={active} onChange={setActive} />
              <Toggle label="Tampil di homepage" checked={onHome} onChange={setOnHome} />
              <Toggle label={'Label "Best seller"'} checked={bestSeller} onChange={setBestSeller} />
            </div>
          </Card>
          <Card title="Preview kartu">
            <div className="relative h-52 overflow-hidden rounded-2xl text-white">
              {cover && !cover.file && <Photo src={cover.src} alt="" fill sizes="360px" position={cover.position} />}
              {cover?.file && (
                // eslint-disable-next-line @next/next/no-img-element -- pratinjau file lokal (blob URL)
                <img src={cover.src} alt="" className="absolute inset-0 h-full w-full object-cover" />
              )}
              <div className="scrim-bottom absolute inset-0" />
              {bestSeller && <span className="absolute top-3 left-3 rounded-full bg-sun px-2.5 py-1 text-[11px] font-bold text-ink">Best seller</span>}
              <span className="absolute inset-x-4 bottom-3.5 flex flex-col gap-1">
                <span className="font-display text-xl leading-tight font-semibold">{title || "Tanpa nama"}</span>
                <span className="text-[13px] font-bold">from {priceNum > 0 ? rupiah(priceNum) : "—"} / person</span>
              </span>
            </div>
            {!active && <p className="text-[13px] font-semibold text-bad">Paket nonaktif: gak muncul di website.</p>}
          </Card>
          <Card title="Kualitas konten" action={<span className="text-[13px] font-bold text-sea-dark tabular-nums">{done} / {checks.length}</span>}>
            <ul className="flex flex-col gap-2.5 text-sm">
              {checks.map((c) => (
                <li key={c.label} className={`flex items-start gap-2.5 ${c.ok ? "" : "font-semibold text-bad"}`}>
                  {c.ok ? <CheckCircle size={18} className="mt-px shrink-0 text-sea" /> : <Alert size={18} className="mt-px shrink-0" />}
                  {c.ok ? c.label : c.todo}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
