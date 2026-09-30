import type { Metadata } from "next";
import { GoogleRatingForm, ReviewsManager } from "@/components/admin/ReviewsManager";
import { PageTitle } from "@/components/admin/ui";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Ulasan tamu" };

export default async function ReviewsPage() {
  const supabase = await createClient();
  const [reviewsRes, settingsRes, toursRes, vehiclesRes] = await Promise.all([
    supabase.from("reviews").select("*").order("sort").order("created_at", { ascending: false }),
    supabase.from("site_settings").select("google_rating, google_review_count, google_reviews_url").eq("id", 1).maybeSingle(),
    supabase.from("tours").select("title").order("sort"),
    supabase.from("vehicles").select("name").order("sort"),
  ]);
  if (reviewsRes.error) throw new Error(reviewsRes.error.message);
  const reviews = reviewsRes.data;
  const settings = settingsRes.data ?? { google_rating: null, google_review_count: null, google_reviews_url: null };
  const services = [
    ...(toursRes.data ?? []).map((t) => t.title),
    ...(vehiclesRes.data ?? []).map((v) => `${v.name} rental`),
    "Airport transfer",
    "Private driver",
  ];
  const published = reviews.filter((r) => r.published).length;

  return (
    <>
      <PageTitle title="Ulasan tamu" subtitle={`${reviews.length} ulasan · ${published} tampil di website`} />
      <GoogleRatingForm settings={{ ...settings, google_rating: settings.google_rating === null ? null : Number(settings.google_rating) }} />
      <ReviewsManager reviews={reviews} services={services} />
    </>
  );
}
