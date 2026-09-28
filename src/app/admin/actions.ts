"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { bookingKinds, bookingStatuses, channels, unitStatuses } from "@/lib/booking-meta";
import { supabaseUrl } from "@/lib/supabase/env";

export type ActionResult = { ok: true } | { ok: false; error: string };

const ok: ActionResult = { ok: true };
const fail = (error: string): ActionResult => ({ ok: false, error });

const publicPhotoPrefix = `${supabaseUrl}/storage/v1/object/public/photos/`;
const isAllowedPhotoUrl = (url: string) => url.startsWith("/images/") || (supabaseUrl !== "" && url.startsWith(publicPhotoPrefix));
const storagePathFromUrl = (url: string | null | undefined) => (url && url.startsWith(publicPhotoPrefix) ? decodeURIComponent(url.slice(publicPhotoPrefix.length)) : null);
const isoDate = (v: unknown) => (typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : null);
const intOrNull = (v: unknown) => {
  if (v === null || v === undefined || v === "") return null;
  const n = Math.round(Number(v));
  return Number.isFinite(n) && n >= 0 ? n : null;
};

/** Refresh semua halaman publik (konten dari database berubah). */
function refreshSite() {
  revalidatePath("/", "layout");
}

async function guard<T>(fn: () => Promise<T>): Promise<T | ActionResult> {
  try {
    return await fn();
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Terjadi kesalahan.");
  }
}

// ---------------------------------------------------------------------------
// Booking
// ---------------------------------------------------------------------------

export async function updateBooking(id: string, patch: { status?: string; unitId?: string | null }): Promise<ActionResult> {
  return guard(async () => {
    const { supabase } = await requireAdmin();
    const update: { status?: string; unit_id?: string | null } = {};
    if (patch.status !== undefined) {
      if (!(bookingStatuses as readonly string[]).includes(patch.status)) return fail("Status tidak dikenal.");
      update.status = patch.status;
    }
    if (patch.unitId !== undefined) update.unit_id = patch.unitId || null;
    const { error } = await supabase.from("bookings").update(update).eq("id", id);
    if (error) return fail(error.message);
    revalidatePath("/admin", "layout");
    return ok;
  }) as Promise<ActionResult>;
}

export async function createManualBooking(formData: FormData): Promise<ActionResult> {
  return guard(async () => {
    const { supabase } = await requireAdmin();
    const kind = String(formData.get("kind") ?? "");
    const channel = String(formData.get("channel") ?? "whatsapp");
    const guest = String(formData.get("guest_name") ?? "").trim();
    const item = String(formData.get("item_title") ?? "").trim();
    const start = isoDate(formData.get("start_date"));
    const end = isoDate(formData.get("end_date"));
    if (!(bookingKinds as readonly string[]).includes(kind)) return fail("Pilih jenis layanan.");
    if (!(channels as readonly string[]).includes(channel)) return fail("Sumber booking tidak dikenal.");
    if (!guest || !item) return fail("Nama tamu dan layanan wajib diisi.");
    if (start && end && end < start) return fail("Tanggal selesai harus setelah tanggal mulai.");
    const { error } = await supabase.from("bookings").insert({
      kind,
      channel,
      guest_name: guest.slice(0, 120),
      item_title: item.slice(0, 200),
      start_date: start,
      end_date: end,
      quantity: Math.max(1, Math.min(50, intOrNull(formData.get("quantity")) ?? 1)),
      estimated_total: intOrNull(formData.get("estimated_total")),
      location: String(formData.get("location") ?? "").trim().slice(0, 300) || null,
      notes: String(formData.get("notes") ?? "").trim().slice(0, 1000) || null,
      unit_id: String(formData.get("unit_id") ?? "") || null,
      status: "dikonfirmasi",
    });
    if (error) return fail(error.message);
    revalidatePath("/admin", "layout");
    return ok;
  }) as Promise<ActionResult>;
}

// ---------------------------------------------------------------------------
// Armada
// ---------------------------------------------------------------------------

export async function createUnit(formData: FormData): Promise<ActionResult> {
  return guard(async () => {
    const { supabase } = await requireAdmin();
    const plate = String(formData.get("plate") ?? "").trim().toUpperCase().replace(/\s+/g, " ");
    const vehicleId = String(formData.get("vehicle_id") ?? "");
    if (!plate || plate.length > 20) return fail("Isi plat nomor (maks. 20 karakter).");
    if (!vehicleId) return fail("Pilih model kendaraan.");
    const { error } = await supabase.from("fleet_units").insert({
      plate,
      vehicle_id: vehicleId,
      km: intOrNull(formData.get("km")) ?? 0,
      next_service: isoDate(formData.get("next_service")),
    });
    if (error) return fail(error.code === "23505" ? "Plat nomor ini sudah terdaftar." : error.message);
    revalidatePath("/admin", "layout");
    return ok;
  }) as Promise<ActionResult>;
}

export async function updateUnit(id: string, patch: { status?: string; km?: number; nextService?: string | null }): Promise<ActionResult> {
  return guard(async () => {
    const { supabase } = await requireAdmin();
    const update: { status?: string; km?: number; next_service?: string | null } = {};
    if (patch.status !== undefined) {
      if (!(unitStatuses as readonly string[]).includes(patch.status)) return fail("Status unit tidak dikenal.");
      update.status = patch.status;
    }
    if (patch.km !== undefined) update.km = Math.max(0, Math.round(patch.km));
    if (patch.nextService !== undefined) update.next_service = isoDate(patch.nextService);
    const { error } = await supabase.from("fleet_units").update(update).eq("id", id);
    if (error) return fail(error.message);
    revalidatePath("/admin", "layout");
    return ok;
  }) as Promise<ActionResult>;
}

export async function deleteUnit(id: string): Promise<ActionResult> {
  return guard(async () => {
    const { supabase } = await requireAdmin();
    const { error } = await supabase.from("fleet_units").delete().eq("id", id);
    if (error) return fail(error.message);
    revalidatePath("/admin", "layout");
    return ok;
  }) as Promise<ActionResult>;
}

export async function updateVehicle(
  id: string,
  patch: { pricePerDay?: number | null; priceWithDriver?: number | null; active?: boolean; imageUrl?: string },
): Promise<ActionResult> {
  return guard(async () => {
    const { supabase } = await requireAdmin();
    const update: { price_per_day?: number | null; price_with_driver?: number | null; active?: boolean; image_url?: string } = {};
    if (patch.pricePerDay !== undefined) update.price_per_day = intOrNull(patch.pricePerDay);
    if (patch.priceWithDriver !== undefined) update.price_with_driver = intOrNull(patch.priceWithDriver);
    if (patch.active !== undefined) update.active = Boolean(patch.active);
    let oldPath: string | null = null;
    if (patch.imageUrl !== undefined) {
      if (!isAllowedPhotoUrl(patch.imageUrl)) return fail("Alamat foto tidak valid.");
      const { data: current } = await supabase.from("vehicles").select("image_url").eq("id", id).maybeSingle();
      oldPath = storagePathFromUrl(current?.image_url);
      update.image_url = patch.imageUrl;
    }
    const { error } = await supabase.from("vehicles").update(update).eq("id", id);
    if (error) return fail(error.message);
    if (oldPath && oldPath !== storagePathFromUrl(patch.imageUrl)) await supabase.storage.from("photos").remove([oldPath]);
    revalidatePath("/admin", "layout");
    refreshSite();
    return ok;
  }) as Promise<ActionResult>;
}

// ---------------------------------------------------------------------------
// Tour & foto
// ---------------------------------------------------------------------------

export type PhotoInput = { url: string; storagePath: string | null; alt: string; position?: string | null };

async function replacePhotos(scope: "tour" | "hero", tourId: string | null, photos: PhotoInput[]): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  if (photos.length > 20) return fail("Maksimal 20 foto.");
  for (const p of photos) if (!isAllowedPhotoUrl(p.url)) return fail("Ada alamat foto yang tidak valid.");

  let existingQuery = supabase.from("photos").select("id, storage_path").eq("scope", scope);
  existingQuery = tourId ? existingQuery.eq("tour_id", tourId) : existingQuery.is("tour_id", null);
  const { data: existing, error: readError } = await existingQuery;
  if (readError) return fail(readError.message);

  const rows = photos.map((p, i) => ({
    scope,
    tour_id: tourId,
    url: p.url,
    storage_path: p.storagePath ?? storagePathFromUrl(p.url),
    alt: String(p.alt ?? "").slice(0, 200),
    position: p.position ?? null,
    sort: i,
  }));
  if (rows.length) {
    const { error } = await supabase.from("photos").insert(rows);
    if (error) return fail(error.message);
  }
  if (existing.length) {
    const { error } = await supabase.from("photos").delete().in("id", existing.map((e) => e.id));
    if (error) return fail(error.message);
  }
  const keep = new Set(rows.map((r) => r.storage_path).filter(Boolean));
  const orphaned = existing.map((e) => e.storage_path).filter((p): p is string => Boolean(p) && !keep.has(p));
  if (orphaned.length) await supabase.storage.from("photos").remove(orphaned);
  return ok;
}

export type TourInfoInput = {
  title: string;
  summary: string;
  summaryId: string;
  duration: string;
  priceFrom: number;
  active: boolean;
  featured: boolean;
  bestSeller: boolean;
};

export async function saveTour(tourId: string, info: TourInfoInput, photos: PhotoInput[]): Promise<ActionResult> {
  return guard(async () => {
    const { supabase } = await requireAdmin();
    const title = String(info.title ?? "").trim();
    if (!title) return fail("Nama paket wajib diisi.");
    const price = intOrNull(info.priceFrom);
    if (price === null) return fail("Harga harus angka.");
    const { data: current, error: readError } = await supabase.from("tours").select("slug, badge").eq("id", tourId).maybeSingle();
    if (readError || !current) return fail(readError?.message ?? "Paket tidak ditemukan.");
    const badge = info.bestSeller ? "Best seller" : current.badge === "Best seller" ? null : current.badge;
    const { error } = await supabase
      .from("tours")
      .update({
        title: title.slice(0, 200),
        summary: String(info.summary ?? "").slice(0, 2000),
        summary_id: String(info.summaryId ?? "").slice(0, 2000),
        duration: String(info.duration ?? "").slice(0, 60),
        price_from: price,
        active: Boolean(info.active),
        featured: Boolean(info.featured),
        badge,
      })
      .eq("id", tourId);
    if (error) return fail(error.message);
    const photoResult = await replacePhotos("tour", tourId, photos);
    if (!photoResult.ok) return photoResult;
    revalidatePath("/admin", "layout");
    refreshSite();
    return ok;
  }) as Promise<ActionResult>;
}

export async function saveHeroPhotos(photos: PhotoInput[]): Promise<ActionResult> {
  return guard(async () => {
    if (photos.length === 0) return fail("Minimal 1 foto header.");
    if (photos.length > 5) return fail("Maksimal 5 foto header.");
    const result = await replacePhotos("hero", null, photos);
    if (!result.ok) return result;
    revalidatePath("/admin", "layout");
    refreshSite();
    return ok;
  }) as Promise<ActionResult>;
}
