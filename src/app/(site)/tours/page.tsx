import type { Metadata } from "next";
import { tourCategories, type TourCategory } from "@/data/tours";
import { TourBrowser } from "@/components/tours/TourBrowser";
import { PageHeader } from "@/components/PageHeader";
import { getTours } from "@/lib/content";

export const metadata: Metadata = {
  title: "Tours & activities",
  description: "Curated Bali day trips with transport, tickets and lunch sorted: Nusa Penida, Mount Batur, Uluwatu, Ubud and more.",
};

export default async function ToursPage({ searchParams }: PageProps<"/tours">) {
  const sp = await searchParams;
  const raw = Array.isArray(sp.category) ? sp.category[0] : sp.category;
  const initial = tourCategories.some((c) => c.id === raw) ? (raw as TourCategory) : "all";
  const tours = await getTours();
  return (
    <>
      <PageHeader
        eyebrow="Tours & activities"
        title="Bali's best days out, with the ride sorted."
        text="Every tour includes hotel pick-up and a private car. Book on WhatsApp, pay a small deposit, and just show up."
      />
      <section className="px-4 py-12 sm:px-6 lg:px-16 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <TourBrowser key={initial} tours={tours} initial={initial} />
        </div>
      </section>
    </>
  );
}
