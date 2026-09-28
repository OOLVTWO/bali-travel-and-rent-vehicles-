import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TourEditor, type TourEditorData } from "@/components/admin/TourEditor";
import { ChevronRight } from "@/components/icons";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Edit paket tour" };

export default async function EditTourPage({ params }: PageProps<"/admin/tours/[slug]">) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: row, error } = await supabase.from("tours").select("*").eq("slug", slug).maybeSingle();
  if (error) throw new Error(error.message);
  if (!row) notFound();
  const { data: photos, error: photoError } = await supabase.from("photos").select("*").eq("scope", "tour").eq("tour_id", row.id).order("sort");
  if (photoError) throw new Error(photoError.message);

  const itinerary = Array.isArray(row.itinerary)
    ? row.itinerary.flatMap((s) => (s && typeof s === "object" && !Array.isArray(s) && typeof s.title === "string" ? [{ time: typeof s.time === "string" ? s.time : "", title: s.title }] : []))
    : [];

  const tour: TourEditorData = {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    summaryId: row.summary_id ?? "",
    duration: row.duration,
    priceFrom: row.price_from,
    active: row.active,
    featured: row.featured,
    bestSeller: row.badge === "Best seller",
    itinerary,
    photos: photos.map((p) => ({ id: p.id, src: p.url, alt: p.alt, position: p.position ?? undefined, storagePath: p.storage_path })),
  };

  return (
    <>
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-[13px] text-muted">
        <Link href="/admin/content" className="hover:text-ink">Konten & foto</Link>
        <ChevronRight size={14} />
        <Link href="/admin/tours" className="hover:text-ink">Paket tour</Link>
        <ChevronRight size={14} />
        <span className="font-semibold text-ink">{row.title}</span>
      </nav>
      <TourEditor tour={tour} />
    </>
  );
}
