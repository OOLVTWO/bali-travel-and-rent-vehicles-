import type { MetadataRoute } from "next";
import { articles } from "@/data/articles";
import { site } from "@/data/site";
import { getTours, getVehicles } from "@/lib/content";

// Diperbarui tiap jam; perubahan dari panel admin juga langsung me-refresh.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [tours, vehicles] = await Promise.all([getTours(), getVehicles()]);
  const url = (path: string) => `${site.url}${path}`;
  return [
    { url: url("/"), changeFrequency: "weekly", priority: 1 },
    ...["/rentals", "/tours", "/deals", "/planner", "/guide"].map((p) => ({ url: url(p), changeFrequency: "weekly" as const, priority: 0.8 })),
    ...vehicles.map((v) => ({ url: url(`/rentals/${v.slug}`), changeFrequency: "weekly" as const, priority: 0.7 })),
    ...tours.map((t) => ({ url: url(`/tours/${t.slug}`), changeFrequency: "weekly" as const, priority: 0.7 })),
    ...articles.map((a) => ({ url: url(`/guide/${a.slug}`), changeFrequency: "monthly" as const, priority: 0.5 })),
  ];
}
