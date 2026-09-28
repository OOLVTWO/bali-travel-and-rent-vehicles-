"use client";

import { useId, useState, useTransition } from "react";
import { updateVehicle } from "@/app/admin/actions";
import { Upload } from "@/components/icons";
import { removeUploaded, uploadPhoto } from "@/lib/upload";

/** Ganti foto satu model kendaraan: upload langsung, lalu simpan ke database. */
export function VehiclePhotoUpload({ vehicleId, name }: { vehicleId: string; name: string }) {
  const id = useId();
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  function onFile(file: File | undefined) {
    if (!file) return;
    setStatus(null);
    startTransition(async () => {
      let path: string | null = null;
      try {
        const up = await uploadPhoto(file, `vehicles/${vehicleId}`);
        path = up.storagePath;
        const res = await updateVehicle(vehicleId, { imageUrl: up.url });
        if (!res.ok) throw new Error(res.error);
        setStatus({ ok: true, text: "Foto diganti" });
      } catch (e) {
        if (path) await removeUploaded([path]);
        setStatus({ ok: false, text: e instanceof Error ? e.message : "Upload gagal" });
      }
    });
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className={`flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-line text-[13px] font-bold hover:bg-mist ${pending ? "pointer-events-none opacity-60" : ""}`}>
        <Upload size={16} /> {pending ? "Mengupload…" : "Ganti foto"}
      </label>
      <input
        id={id}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="sr-only"
        aria-label={`Ganti foto ${name}`}
        disabled={pending}
        onChange={(e) => {
          onFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      {status && <span role={status.ok ? "status" : "alert"} className={`text-xs font-semibold ${status.ok ? "text-sea-dark" : "text-bad"}`}>{status.text}</span>}
    </div>
  );
}
