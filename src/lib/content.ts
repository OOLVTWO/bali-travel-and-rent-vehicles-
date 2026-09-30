import { img } from "@/data/images";
import { tourCategories, tours as staticTours, type Tour, type TourCategory } from "@/data/tours";
import { vehicles as staticVehicles, type Vehicle } from "@/data/vehicles";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createPublicClient } from "@/lib/supabase/server";
import type { Json, Tables } from "@/lib/supabase/database.types";
import type { Review, ReviewSummary } from "@/lib/reviews";

export type Slide = { src: string; alt: string; position?: string };

const validCategories = new Set(tourCategories.map((c) => c.id));

function toVehicle(row: Tables<"vehicles">): Vehicle {
  return {
    slug: row.slug,
    name: row.name,
    category: row.category === "car" ? "car" : "scooter",
    subtitle: row.subtitle,
    seats: row.seats,
    transmission: row.transmission === "Manual" ? "Manual" : "Automatic",
    image: row.image_url || (row.category === "car" ? img.carSilver : img.scooterCream),
    tint: row.tint,
    badge: row.badge ?? undefined,
    pricePerDay: row.price_per_day,
    priceWithDriver: row.price_with_driver,
    highlights: row.highlights,
    included: row.included,
  };
}

function asArray<T>(value: Json, pick: (v: Record<string, Json | undefined>) => T | null): T[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((v) => {
    if (!v || typeof v !== "object" || Array.isArray(v)) return [];
    const out = pick(v);
    return out ? [out] : [];
  });
}

const str = (v: Json | undefined) => (typeof v === "string" ? v : undefined);

function toTour(row: Tables<"tours">, photos: Tables<"photos">[]): Tour {
  const gallery = photos.map((p) => ({ src: p.url, alt: p.alt, position: p.position ?? undefined }));
  const highlights = asArray(row.highlights, (h) => {
    const name = str(h.name);
    const image = str(h.image);
    return name && image ? { name, image, position: str(h.position) } : null;
  });
  const cover = gallery[0] ?? (highlights[0] ? { src: highlights[0].image, alt: row.title, position: highlights[0].position } : { src: img.cliff, alt: row.title });
  return {
    slug: row.slug,
    title: row.title,
    area: row.area,
    categories: row.categories.filter((c): c is TourCategory => validCategories.has(c as TourCategory)),
    duration: row.duration,
    pickup: row.pickup,
    summary: row.summary,
    image: cover.src,
    imagePosition: cover.position,
    gallery: gallery.length ? gallery : [cover],
    facts: row.facts,
    highlights,
    itinerary: asArray(row.itinerary, (s) => {
      const time = str(s.time);
      const title = str(s.title);
      return time !== undefined && title ? { time, title } : null;
    }),
    included: row.included,
    excluded: row.excluded,
    priceFrom: row.price_from,
    badge: row.badge ?? undefined,
    featured: row.featured,
  };
}

export async function getVehicles(): Promise<Vehicle[]> {
  if (!isSupabaseConfigured) return staticVehicles;
  const supabase = createPublicClient();
  const { data, error } = await supabase.from("vehicles").select("*").eq("active", true).order("sort");
  if (error) {
    console.error("getVehicles:", error.message);
    return staticVehicles;
  }
  return data.map(toVehicle);
}

export async function getVehicle(slug: string): Promise<Vehicle | undefined> {
  const list = await getVehicles();
  return list.find((v) => v.slug === slug);
}

export async function getTours(): Promise<Tour[]> {
  if (!isSupabaseConfigured) return staticTours;
  const supabase = createPublicClient();
  const [toursRes, photosRes] = await Promise.all([
    supabase.from("tours").select("*").eq("active", true).order("sort"),
    supabase.from("photos").select("*").eq("scope", "tour").order("sort"),
  ]);
  if (toursRes.error || photosRes.error) {
    console.error("getTours:", toursRes.error?.message ?? photosRes.error?.message);
    return staticTours;
  }
  const byTour = new Map<string, Tables<"photos">[]>();
  for (const p of photosRes.data) {
    if (!p.tour_id) continue;
    const list = byTour.get(p.tour_id) ?? [];
    list.push(p);
    byTour.set(p.tour_id, list);
  }
  return toursRes.data.map((t) => toTour(t, byTour.get(t.id) ?? []));
}

export async function getTour(slug: string): Promise<Tour | undefined> {
  const list = await getTours();
  return list.find((t) => t.slug === slug);
}

/** Ulasan yang ditampilkan di website (maks. 6, urutan dari admin). */
export async function getReviews(): Promise<Review[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("id, guest_name, country, rating, quote, source, service")
    .eq("published", true)
    .order("sort")
    .order("created_at", { ascending: false })
    .limit(6);
  if (error) {
    console.error("getReviews:", error.message);
    return [];
  }
  return data.map((r) => ({ id: r.id, name: r.guest_name, country: r.country, rating: r.rating, quote: r.quote, source: r.source, service: r.service }));
}

/** Rating Google di header. null = belum diisi admin, baris rating disembunyikan. */
export async function getReviewSummary(): Promise<ReviewSummary | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = createPublicClient();
  const { data, error } = await supabase.from("site_settings").select("google_rating, google_review_count, google_reviews_url").eq("id", 1).maybeSingle();
  if (error || !data || data.google_rating === null) return null;
  return { rating: Number(data.google_rating), count: data.google_review_count, url: data.google_reviews_url };
}

const staticSlides: Slide[] =[{ src: img.hero, alt: "Rice terraces near Ubud at sunset with Mount Agung behind", position: "70% 50%" }];

export async function getHeroSlides(): Promise<Slide[]> {
  if (!isSupabaseConfigured) return staticSlides;
  const supabase = createPublicClient();
  const { data, error } = await supabase.from("photos").select("url, alt, position").eq("scope", "hero").order("sort").limit(5);
  if (error || !data.length) return staticSlides;
  return data.map((p) => ({ src: p.url, alt: p.alt, position: p.position ?? undefined }));
}
