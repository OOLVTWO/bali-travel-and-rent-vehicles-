import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTour, getTours, getVehicles } from "@/lib/content";
import { Photo } from "@/components/Photo";
import { BookingForm } from "@/components/BookingForm";
import { TourGallery } from "@/components/tours/TourGallery";
import { ArrowLeft, Check, CheckCircle, X } from "@/components/icons";
import { rupiah } from "@/lib/format";

export async function generateStaticParams() {
  const tours = await getTours();
  return tours.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps<"/tours/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const t = await getTour(slug);
  return t ? { title: t.title, description: t.summary } : {};
}

export default async function TourPage({ params }: PageProps<"/tours/[slug]">) {
  const { slug } = await params;
  const [tour, vehicles] = await Promise.all([getTour(slug), getVehicles()]);
  if (!tour) notFound();
  // Tawaran sewa motor: motor lepas kunci termurah
  const scooter = vehicles.filter((v) => v.category === "scooter" && v.pricePerDay !== null).sort((a, b) => (a.pricePerDay ?? 0) - (b.pricePerDay ?? 0))[0];

  return (
    <>
      <section className="px-4 pt-8 pb-28 sm:px-6 lg:px-16 lg:pt-10 lg:pb-20">
        <div className="mx-auto flex max-w-7xl flex-col gap-8">
          <Link href="/tours" className="flex items-center gap-2 self-start text-sm font-bold text-sea">
            <ArrowLeft size={18} /> All tours
          </Link>
          <div className="grid gap-10 lg:grid-cols-[1fr_420px]">
            <div className="flex min-w-0 flex-col gap-9">
              <TourGallery items={tour.gallery} />

              <div className="flex flex-col gap-3.5">
                <div className="flex flex-wrap gap-2">
                  {tour.badge && <span className="rounded-full bg-sun px-2.5 py-1 text-xs font-bold">{tour.badge}</span>}
                  <span className="rounded-full bg-sea-soft px-2.5 py-1 text-xs font-bold text-sea">Private car</span>
                  <span className="rounded-full bg-mist px-2.5 py-1 text-xs font-bold text-body">{tour.area}</span>
                </div>
                <h1 className="font-display text-4xl leading-[1.08] font-semibold tracking-[-0.015em] sm:text-5xl">{tour.title}</h1>
                <p className="text-[17px] leading-relaxed text-body">{tour.summary}</p>
              </div>

              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {tour.facts.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 rounded-xl bg-mist px-3.5 py-3 text-sm font-semibold">
                    <CheckCircle size={18} className="shrink-0 text-sea" />
                    {f}
                  </li>
                ))}
              </ul>

              {scooter && scooter.pricePerDay && (
                <div className="flex items-center gap-4 rounded-2xl border border-dashed border-sea p-4">
                  <span className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-xl ${scooter.tint}`}>
                    <Photo src={scooter.image} alt="" fill sizes="80px" className="object-contain p-1.5" />
                  </span>
                  <span className="flex flex-1 flex-col">
                    <span className="font-bold">Free days after the tour?</span>
                    <span className="text-sm text-muted">Add a {scooter.name} · {rupiah(scooter.pricePerDay)}/day, delivered to your villa</span>
                  </span>
                  <Link href={`/rentals/${scooter.slug}`} className="flex h-11 shrink-0 items-center rounded-xl border border-ink px-4 text-sm font-bold">Add</Link>
                </div>
              )}

              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-bold">Highlights</h2>
                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {tour.highlights.map((h) => (
                    <li key={h.name} className="flex flex-col gap-2">
                      <span className="relative block h-28 overflow-hidden rounded-xl">
                        <Photo src={h.image} alt="" fill sizes="(min-width: 640px) 200px, 45vw" position={h.position} />
                      </span>
                      <span className="text-sm font-semibold">{h.name}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-bold">Itinerary</h2>
                <ol className="flex flex-col">
                  {tour.itinerary.map((s, i) => (
                    <li key={i} className="flex gap-4 border-l-2 border-line py-2.5 pl-5">
                      <span className="w-14 shrink-0 font-bold tabular-nums text-sea">{s.time}</span>
                      <span>{s.title}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="grid gap-8 sm:grid-cols-2">
                <div className="flex flex-col gap-3">
                  <h2 className="text-xl font-bold">Included</h2>
                  <ul className="flex flex-col gap-2.5">
                    {tour.included.map((i) => (
                      <li key={i} className="flex items-start gap-2.5 text-[15px]"><Check size={18} className="mt-0.5 shrink-0 text-sea" />{i}</li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col gap-3">
                  <h2 className="text-xl font-bold">Not included</h2>
                  <ul className="flex flex-col gap-2.5">
                    {tour.excluded.map((i) => (
                      <li key={i} className="flex items-start gap-2.5 text-[15px] text-body"><X size={18} className="mt-0.5 shrink-0 text-muted" />{i}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <aside id="book" aria-labelledby="book-title" className="flex scroll-mt-24 flex-col gap-5 self-start rounded-[24px] border border-line p-6 lg:sticky lg:top-24">
              <div className="flex flex-col gap-1">
                <h2 id="book-title" className="font-display text-2xl font-semibold">Book this tour</h2>
                <span className="text-muted">from <strong className="text-ink">{rupiah(tour.priceFrom)}</strong> per person</span>
              </div>
              <BookingForm kind="tour" title={tour.title} unitPrice={tour.priceFrom} tourSlug={tour.slug} />
            </aside>
          </div>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-3 border-t border-line bg-white px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] lg:hidden">
        <span className="flex flex-col">
          <span className="text-xs text-muted">from</span>
          <span className="text-lg font-bold">{rupiah(tour.priceFrom)} <span className="text-[13px] font-medium text-muted">/ person</span></span>
        </span>
        <a href="#book" className="flex h-12 items-center rounded-xl bg-sun px-5 text-[15px] font-bold text-ink">Check availability</a>
      </div>
    </>
  );
}
