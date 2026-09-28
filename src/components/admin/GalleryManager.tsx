"use client";

import { useId, useState } from "react";
import type { PhotoInput } from "@/app/admin/actions";
import { Photo } from "@/components/Photo";
import { ChevronRight, Trash, Upload } from "@/components/icons";
import { uploadPhoto } from "@/lib/upload";

/** `file` terisi = foto baru yang belum di-upload (pratinjau pakai blob URL). */
export type GalleryPhoto = { id: string; src: string; alt: string; position?: string; storagePath?: string | null; file?: File };

/** Upload semua foto baru ke Storage, lalu balikin daftar siap simpan + path yang baru di-upload. */
export async function uploadPending(photos: GalleryPhoto[], folder: string, onProgress?: (done: number, total: number) => void) {
  const pending = photos.filter((p) => p.file);
  const uploaded: string[] = [];
  const result: PhotoInput[] = [];
  let done = 0;
  onProgress?.(0, pending.length);
  try {
    for (const p of photos) {
      if (p.file) {
        const up = await uploadPhoto(p.file, folder);
        uploaded.push(up.storagePath);
        result.push({ url: up.url, storagePath: up.storagePath, alt: p.alt, position: p.position ?? null });
        onProgress?.(++done, pending.length);
      } else {
        result.push({ url: p.src, storagePath: p.storagePath ?? null, alt: p.alt, position: p.position ?? null });
      }
    }
  } catch (e) {
    return { ok: false as const, error: e instanceof Error ? e.message : "Upload gagal.", uploaded };
  }
  return { ok: true as const, photos: result, uploaded };
}

type Props = {
  photos: GalleryPhoto[];
  onChange: (next: GalleryPhoto[]) => void;
  max?: number;
  /** Label foto pertama, misal "Cover" */
  firstLabel?: string;
};

/**
 * Kelola galeri: tambah foto, hapus, geser urutan, jadikan foto pertama, dan isi alt text.
 * Foto baru baru di-upload ke server saat tombol simpan di halaman induk ditekan.
 */
export function GalleryManager({ photos, onChange, max = 12, firstLabel = "Cover" }: Props) {
  const id = useId();
  const [selected, setSelected] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const sel = photos[Math.min(selected, photos.length - 1)];

  function addFiles(files: FileList | null) {
    if (!files) return;
    const room = max - photos.length;
    const added = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, room)
      .map((f) => ({ id: `${f.name}-${f.size}-${Math.random().toString(36).slice(2, 7)}`, src: URL.createObjectURL(f), alt: "", file: f }));
    if (added.length) onChange([...photos, ...added]);
  }

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= photos.length) return;
    const next = [...photos];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
    setSelected(j);
  }

  function makeFirst(i: number) {
    const next = [...photos];
    const [p] = next.splice(i, 1);
    onChange([p, ...next]);
    setSelected(0);
  }

  function remove(i: number) {
    const p = photos[i];
    if (p.file) URL.revokeObjectURL(p.src);
    onChange(photos.filter((_, k) => k !== i));
    setSelected((s) => Math.max(0, Math.min(s, photos.length - 2)));
  }

  function setAlt(alt: string) {
    onChange(photos.map((p, k) => (k === selected ? { ...p, alt } : p)));
  }

  return (
    <div className="flex flex-col gap-4">
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4" aria-label="Foto galeri">
        {photos.map((p, i) => (
          <li key={p.id} className={`group relative h-28 overflow-hidden rounded-xl ${i === selected ? "ring-[3px] ring-sea" : ""}`}>
            <button type="button" onClick={() => setSelected(i)} aria-label={`Pilih foto ${i + 1}`} aria-pressed={i === selected} className="absolute inset-0">
              {p.file ? (
                // eslint-disable-next-line @next/next/no-img-element -- pratinjau file lokal (blob URL)
                <img src={p.src} alt="" className="h-full w-full object-cover" />
              ) : (
                <Photo src={p.src} alt="" fill sizes="200px" position={p.position} />
              )}
            </button>
            <span className={`pointer-events-none absolute top-2 left-2 rounded-md px-1.5 py-0.5 text-[11px] font-bold ${i === 0 ? "bg-ink text-white" : "bg-white/90 text-ink"}`}>
              {i === 0 ? firstLabel : i + 1}
            </span>
            {p.file && <span className="pointer-events-none absolute right-2 bottom-2 rounded-md bg-sun px-1.5 py-0.5 text-[11px] font-bold text-ink">Baru</span>}
          </li>
        ))}
        {photos.length < max && (
          <li>
            <label
              htmlFor={`${id}-file`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
              className={`flex h-28 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed text-center text-[13px] font-semibold text-muted ${dragOver ? "border-sea bg-sea-soft" : "border-line bg-[#f4fafb] hover:border-sea"}`}
            >
              <Upload size={22} />
              Tarik foto ke sini
              <span className="text-[11px] font-medium">atau klik untuk pilih</span>
            </label>
            <input id={`${id}-file`} type="file" accept="image/*" multiple className="sr-only" onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />
          </li>
        )}
      </ul>

      {sel && (
        <div className="flex flex-col gap-3 rounded-xl bg-mist p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-bold">Foto {Math.min(selected, photos.length - 1) + 1} dipilih</span>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => move(selected, -1)} disabled={selected === 0} className="flex h-9 items-center gap-1 rounded-lg border border-line bg-white px-3 text-[13px] font-bold disabled:opacity-40">
                <ChevronRight size={16} className="rotate-180" /> Geser kiri
              </button>
              <button type="button" onClick={() => move(selected, 1)} disabled={selected >= photos.length - 1} className="flex h-9 items-center gap-1 rounded-lg border border-line bg-white px-3 text-[13px] font-bold disabled:opacity-40">
                Geser kanan <ChevronRight size={16} />
              </button>
              {selected !== 0 && (
                <button type="button" onClick={() => makeFirst(selected)} className="flex h-9 items-center rounded-lg border border-line bg-white px-3 text-[13px] font-bold">
                  Jadikan {firstLabel.toLowerCase()}
                </button>
              )}
              <button type="button" onClick={() => remove(selected)} className="flex h-9 items-center gap-1 rounded-lg border border-bad/30 bg-white px-3 text-[13px] font-bold text-bad">
                <Trash size={16} /> Hapus
              </button>
            </div>
          </div>
          <label className="flex flex-col gap-1.5 text-[13px] font-bold" htmlFor={`${id}-alt`}>
            Keterangan foto (alt text, bagus buat SEO)
            <input id={`${id}-alt`} value={sel.alt} onChange={(e) => setAlt(e.target.value)} placeholder="Contoh: Kelingking Beach viewpoint on Nusa Penida" className="h-11 rounded-lg border border-line bg-white px-3 text-sm font-medium" />
          </label>
        </div>
      )}
      <p className="text-xs text-muted">{photos.length} / {max} foto · JPG, PNG atau WebP. Foto otomatis dikecilkan (maks. 2400 px) sebelum di-upload, jadi foto HP langsung aja.</p>
    </div>
  );
}
