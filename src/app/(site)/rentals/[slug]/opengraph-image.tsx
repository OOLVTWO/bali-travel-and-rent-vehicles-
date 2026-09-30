import { ogCard, ogContentType, ogSize } from "@/lib/og";
import { site } from "@/data/site";
import { getVehicle, getVehicles } from "@/lib/content";
import { rupiah } from "@/lib/format";

export const alt = `Vehicle rental in Bali with ${site.name}`;
export const size = ogSize;
export const contentType = ogContentType;

// Dibikin sekali lalu disimpan (refresh tiap 5 menit / saat admin menyimpan), bukan tiap kali link dibuka.
export const revalidate = 300;

export async function generateStaticParams() {
  return (await getVehicles()).map((v) => ({ slug: v.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const v = await getVehicle(slug);
  if (!v) return ogCard({ eyebrow: "Bali rentals", title: "Scooters & cars delivered to your villa" });
  const selfDrive = v.pricePerDay !== null ? `From ${rupiah(v.pricePerDay)} / day` : null;
  const driver = v.priceWithDriver !== null ? `${selfDrive ? "with driver" : "With driver from"} ${rupiah(v.priceWithDriver)} / day` : null;
  return ogCard({
    eyebrow: v.subtitle,
    title: `${v.name} rental`,
    meta: [selfDrive, driver].filter(Boolean).join(" · ") || "Delivered to your villa",
  });
}
