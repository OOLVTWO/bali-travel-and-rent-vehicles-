import type { Metadata } from "next";
import { combos } from "@/data/combos";
import { Photo } from "@/components/Photo";
import { BookingForm } from "@/components/BookingForm";
import { PageHeader } from "@/components/PageHeader";
import { Check } from "@/components/icons";
import { rupiah } from "@/lib/format";

export const metadata: Metadata = {
  title: "Combo deals",
  description: "Airport pick-up, scooters, cars with driver and tours bundled in one booking.",
};

export default function DealsPage() {
  return (
    <>
      <PageHeader eyebrow="Combo deals" title="Bundle it, save more." text="Rides and tours in one booking, one payment and one WhatsApp thread." />
      <div className="flex flex-col gap-16 px-4 py-14 sm:px-6 lg:px-16">
        {combos.map((c) => (
          <section key={c.slug} id={c.slug} aria-labelledby={`${c.slug}-title`} className="mx-auto grid w-full max-w-7xl scroll-mt-24 gap-8 lg:grid-cols-[1fr_420px]">
            <div className="flex flex-col gap-6">
              <div className="relative h-64 overflow-hidden rounded-[24px] sm:h-80">
                <Photo src={c.image} alt="" fill sizes="(min-width: 1024px) 60vw, 100vw" />
                <span className="absolute top-4 left-4 rounded-full bg-white px-3 py-1.5 text-[13px] font-bold">{c.tag}</span>
              </div>
              <div className="flex flex-col gap-2">
                <h2 id={`${c.slug}-title`} className="font-display text-4xl font-semibold">{c.name}</h2>
                <span className="text-muted">{c.subtitle}</span>
                <span className="text-2xl font-bold">{rupiah(c.price)}</span>
              </div>
              <ul className="flex flex-col gap-3 text-[16px]">
                {c.includes.map((i) => (
                  <li key={i} className="flex items-start gap-2.5"><Check size={20} className="mt-0.5 shrink-0 text-sea" />{i}</li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-5 self-start rounded-[24px] border border-line p-6">
              <h3 className="font-display text-2xl font-semibold">Book the {c.name}</h3>
              <BookingForm kind="combo" title={c.name} unitPrice={c.price} />
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
