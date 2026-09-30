import { ogCard, ogContentType, ogSize } from "@/lib/og";
import { site } from "@/data/site";
import { getTour, getTours } from "@/lib/content";
import { rupiah } from "@/lib/format";

export const alt = `Tour in Bali with ${site.name}`;
export const size = ogSize;
export const contentType = ogContentType;

// Dibikin sekali lalu disimpan (refresh tiap 5 menit / saat admin menyimpan), bukan tiap kali link dibuka.
export const revalidate = 300;

export async function generateStaticParams() {
  return (await getTours()).map((t) => ({ slug: t.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tour = await getTour(slug);
  if (!tour) return ogCard({ eyebrow: "Bali tours", title: "Curated day trips around Bali" });
  return ogCard({
    eyebrow: `${tour.area} · ${tour.duration}`,
    title: tour.title,
    meta: `From ${rupiah(tour.priceFrom)} / person · ${tour.pickup}`,
  });
}
