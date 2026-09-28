import { createClient } from "@/lib/supabase/client";

const MAX_SIDE = 2400;
const QUALITY = 0.85;

/**
 * Perkecil foto di browser sebelum upload: sisi terpanjang maks. 2400 px, format WebP.
 * Foto HP 8–12 MB biasanya jadi 300–800 KB, jadi upload cepat & website tetap ringan.
 */
export async function shrinkImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Browser gak bisa memproses foto.");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", QUALITY));
  if (!blob) throw new Error("Gagal mengompres foto.");
  // Browser lama yang gak dukung WebP balikin PNG: pakai file asli kalau lebih kecil.
  return blob.type === "image/webp" || blob.size < file.size ? blob : file;
}

const extFor = (type: string) => (type === "image/webp" ? "webp" : type === "image/png" ? "png" : type === "image/avif" ? "avif" : "jpg");

export type Uploaded = { url: string; storagePath: string };

/** Upload satu foto ke bucket "photos" di folder `folder` (misal "tours/<id>"). */
export async function uploadPhoto(file: File, folder: string): Promise<Uploaded> {
  const blob = await shrinkImage(file);
  if (blob.size > 10 * 1024 * 1024) throw new Error(`${file.name} masih lebih dari 10 MB setelah dikompres.`);
  const storagePath = `${folder}/${crypto.randomUUID()}.${extFor(blob.type)}`;
  const supabase = createClient();
  const { error } = await supabase.storage.from("photos").upload(storagePath, blob, { contentType: blob.type || "image/jpeg", cacheControl: "31536000", upsert: false });
  if (error) throw new Error(`Upload ${file.name} gagal: ${error.message}`);
  const { data } = supabase.storage.from("photos").getPublicUrl(storagePath);
  return { url: data.publicUrl, storagePath };
}

/** Hapus file yang terlanjur ke-upload kalau penyimpanan gagal. */
export async function removeUploaded(paths: string[]) {
  if (!paths.length) return;
  await createClient().storage.from("photos").remove(paths);
}
