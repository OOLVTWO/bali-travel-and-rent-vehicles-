"use client";

import { useState, useTransition } from "react";
import { saveHeroPhotos } from "@/app/admin/actions";
import { GalleryManager, uploadPending, type GalleryPhoto } from "@/components/admin/GalleryManager";
import { removeUploaded } from "@/lib/upload";

export function HeroSlidesEditor({ initial }: { initial: GalleryPhoto[] }) {
  const [photos, setPhotos] = useState(initial);
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  function save() {
    setStatus(null);
    startTransition(async () => {
      const up = await uploadPending(photos, "hero", (done, total) => {
        if (total) setStatus({ ok: true, text: `Upload foto ${done}/${total}…` });
      });
      if (!up.ok) {
        await removeUploaded(up.uploaded);
        setStatus({ ok: false, text: up.error });
        return;
      }
      const res = await saveHeroPhotos(up.photos);
      if (!res.ok) {
        await removeUploaded(up.uploaded);
        setStatus({ ok: false, text: res.error });
        return;
      }
      for (const p of photos) if (p.file) URL.revokeObjectURL(p.src);
      setPhotos(up.photos.map((p, i) => ({ id: `${p.url}-${i}`, src: p.url, alt: p.alt, position: p.position ?? undefined, storagePath: p.storagePath })));
      setStatus({ ok: true, text: "Foto header tersimpan & udah tampil di homepage." });
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <GalleryManager photos={photos} onChange={setPhotos} max={5} firstLabel="Utama" />
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={save} disabled={pending || photos.length === 0} className="h-11 rounded-xl bg-sun px-5 text-sm font-bold text-ink disabled:opacity-60">
          {pending ? "Menyimpan…" : "Simpan foto header"}
        </button>
        {status && (
          <p role={status.ok ? "status" : "alert"} className={`text-sm font-semibold ${status.ok ? "text-sea-dark" : "text-bad"}`}>
            {status.ok ? status.text : `Gagal: ${status.text}`}
          </p>
        )}
      </div>
    </div>
  );
}
