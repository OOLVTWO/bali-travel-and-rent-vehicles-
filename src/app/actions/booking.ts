"use server";

import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createPublicClient } from "@/lib/supabase/server";

export type BookingInput = {
  kind: "rental" | "driver" | "tour" | "combo" | "transfer";
  itemTitle: string;
  vehicleSlug?: string;
  tourSlug?: string;
  startDate?: string;
  endDate?: string;
  quantity: number;
  guestName: string;
  location?: string;
  notes?: string;
  estimatedTotal?: number | null;
};

const isoDate = (v?: string) => (v && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : null);

/**
 * Simpan booking dari website ke database (status "baru") dan balikin kode booking.
 * Kalau gagal / Supabase belum diset, balikin null: tamu tetap lanjut ke WhatsApp.
 */
export async function submitBooking(input: BookingInput): Promise<string | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = createPublicClient();
  const { data, error } = await supabase.rpc("create_booking", {
    p_kind: input.kind,
    p_item_title: String(input.itemTitle).slice(0, 200),
    p_vehicle_slug: input.vehicleSlug ?? null,
    p_tour_slug: input.tourSlug ?? null,
    p_start_date: isoDate(input.startDate),
    p_end_date: isoDate(input.endDate),
    p_quantity: Math.max(1, Math.min(50, Math.round(Number(input.quantity) || 1))),
    p_guest_name: String(input.guestName).slice(0, 120),
    p_location: input.location ? String(input.location).slice(0, 300) : null,
    p_notes: input.notes ? String(input.notes).slice(0, 1000) : null,
    p_estimated_total: typeof input.estimatedTotal === "number" && Number.isFinite(input.estimatedTotal) ? Math.round(input.estimatedTotal) : null,
  });
  if (error) {
    console.error("submitBooking:", error.message);
    return null;
  }
  return data;
}
