import Link from "next/link";
import { img } from "@/data/images";
import { reviews, site } from "@/data/site";
import { combos } from "@/data/combos";
import { articles } from "@/data/articles";
import { testimonials } from "@/data/testimonials";
import type { Vehicle } from "@/data/vehicles";
import type { Tour } from "@/data/tours";
import type { Slide } from "@/lib/content";
import { HeroSlides } from "@/components/home/HeroSlides";
import { Photo } from "@/components/Photo";
import { ArticleCard, ComboCard, Stars, WayCard } from "@/components/cards";
import { SectionHeading } from "@/components/site/SectionHeading";
import { SearchBox } from "@/components/home/SearchBox";
import { ArrowRight, Chat, Check, Home, IdCard, Instagram, Shield, WhatsApp } from "@/components/icons";
import { rupiah } from "@/lib/format";
import { waLink } from "@/lib/whatsapp";

export function Hero({ slides }: { slides: Slide[] }) {
  return (
    <section className="relative isolate overflow-hidden text-white">
      <HeroSlides slides={slides} />
      <div className="scrim-hero absolute inset-0 -z-10" />
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 pt-32 pb-10 sm:px-6 lg:min-h-[860px] lg:justify-between lg:px-16 lg:pt-44 lg:pb-14">
        <div className="flex max-w-[740px] flex-col gap-5.5">
          <span className="flex items-center gap-3 text-[13px] font-bold tracking-[0.16em] text-sun uppercase">
            <span className="h-0.5 w-9 bg-sun" aria-hidden="true" />
            Scooters · Cars · Drivers · Tours
          </span>
          <h1 className="font-display text-[52px] leading-none font-semibold tracking-[-0.02em] sm:text-7xl lg:text-[84px]">
            Explore Bali <br className="hidden sm:block" />
            <span className="text-sun">your way.</span>
          </h1>
          <p className="max-w-[600px] text-lg leading-relaxed text-white/90 sm:text-xl">
            Ride it yourself, hire a private driver, or join a curated tour. One booking, one WhatsApp chat, and everything delivered to your villa.
          </p>
          {reviews.rating !== null && (
            <a href={reviews.url ?? "#"} className="flex items-center gap-3.5 text-[15px] font-semibold">
              <Stars />
              <span>{reviews.rating} on Google</span>
              {reviews.count && <span className="font-medium text-white/85">· {reviews.count} reviews</span>}
            </a>
          )}
        </div>
        <SearchBox />
      </div>
    </section>
  );
}

const trust = [
  { Icon: Home, title: "Free delivery to your villa", text: site.freeDeliveryAreas.join(" · ") },
  { Icon: IdCard, title: "No passport hold", text: "Photo ID and a small deposit" },
  { Icon: Shield, title: "Helmets & insurance included", text: "Rain ponchos too" },
  { Icon: Chat, title: "24/7 WhatsApp support", text: "Real people, fast replies" },
];

export function TrustStrip() {
  return (
    <section aria-label="Why book with us" className="border-b border-line-soft bg-white px-4 py-8 sm:px-6 lg:px-16">
      <ul className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {trust.map(({ Icon, title, text }) => (
          <li key={title} className="flex items-center gap-3.5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-sea-soft text-sea"><Icon size={24} /></span>
            <span className="flex flex-col gap-0.5">
              <span className="font-bold">{title}</span>
              <span className="text-sm text-muted">{text}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

const minOf = (values: number[]) => (values.length ? Math.min(...values) : null);
const fromLabel = (value: number | null, unit: string) => (value !== null ? `from ${rupiah(value)} / ${unit}` : "Ask for a price");

export function ThreeWays({ vehicles, tours }: { vehicles: Vehicle[]; tours: Tour[] }) {
  const scooterFrom = minOf(vehicles.flatMap((v) => (v.pricePerDay ? [v.pricePerDay] : [])));
  const driverFrom = minOf(vehicles.flatMap((v) => (v.priceWithDriver ? [v.priceWithDriver] : [])));
  const tourFrom = minOf(tours.map((t) => t.priceFrom));
  return (
    <section aria-labelledby="ways-title" className="px-4 py-20 sm:px-6 lg:px-16 lg:py-24">
      <div className="mx-auto flex max-w-7xl flex-col gap-12">
        <SectionHeading
          id="ways-title"
          eyebrow="Three ways to explore"
          title="However you like to travel, we've got the wheels."
          aside={<p className="max-w-[400px] text-[17px] leading-relaxed text-muted">Mix and match in one booking: a scooter for the beach days, a driver for the long ride up to Kintamani.</p>}
        />
        <div className="grid gap-6 lg:grid-cols-3">
          <WayCard href="/rentals" image={img.terraces} tag="SELF DRIVE" title="Ride it yourself" text="Scooters and cars delivered to your door, with a free route map for every trip." price={fromLabel(scooterFrom, "day")} />
          <WayCard href="/rentals?mode=driver" image={img.temple} tag="WITH A DRIVER" title="Sit back, we drive" text="A private car and an English-speaking local driver for 10 hours. Go wherever you like." price={fromLabel(driverFrom, "day")} />
          <WayCard href="/tours" image={img.cliff} tag="GUIDED TOURS" title="Just show up" text="Curated day trips with transport, tickets and lunch sorted. Private or small group." price={fromLabel(tourFrom, "person")} />
        </div>
      </div>
    </section>
  );
}

export function ComboDeals() {
  return (
    <section aria-labelledby="combo-title" className="px-4 pb-20 sm:px-6 lg:px-16 lg:pb-24">
      <div className="mx-auto flex max-w-7xl flex-col gap-12">
        <SectionHeading
          id="combo-title"
          eyebrow="Combo deals"
          title="Bundle it, save more."
          aside={<p className="max-w-[400px] text-[17px] leading-relaxed text-muted">Rides and tours in one booking, one payment and one WhatsApp thread.</p>}
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {combos.map((c) => (
            <ComboCard key={c.slug} combo={c} />
          ))}
        </div>
      </div>
    </section>
  );
}

const steps = [
  { title: "Pick your ride or tour", text: "Choose dates, where to deliver, and extras like a surfboard rack or a child seat." },
  { title: "Confirm on WhatsApp", text: "Pay a small deposit online. The rest at hand-over: cash, card or QRIS." },
  { title: "We bring it to you", text: "Fuelled up, with helmets, at your villa. We pick it up the same way when you're done." },
];

export function HowItWorks() {
  return (
    <section aria-labelledby="how-title" className="bg-white px-4 py-20 sm:px-6 lg:px-16 lg:py-24">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 lg:flex-row lg:items-center lg:gap-18">
        <div className="relative h-[360px] overflow-hidden rounded-[28px] sm:h-[480px] lg:h-[560px] lg:w-[620px] lg:shrink-0">
          <Photo src={img.beach} alt="Scooter delivered to a villa near the beach" fill sizes="(min-width: 1024px) 620px, 100vw" position="30% 50%" />
          <div className="absolute bottom-6 left-6 flex items-center gap-3 rounded-2xl bg-white px-4.5 py-4 shadow-[0_12px_30px_rgb(13_43_62/0.18)]">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sea-soft text-sea"><Check size={22} /></span>
            <span className="flex flex-col">
              <span className="text-[15px] font-bold">Delivered to your villa</span>
              <span className="text-[13px] text-muted">{site.freeDeliveryAreas.slice(0, 2).join(", ")} and more</span>
            </span>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-9">
          <div className="flex flex-col gap-3.5">
            <span className="text-[13px] font-bold tracking-[0.16em] text-sea uppercase">How it works</span>
            <h2 id="how-title" className="font-display text-4xl leading-[1.08] font-semibold tracking-[-0.015em] sm:text-5xl">From booking to riding in three steps.</h2>
          </div>
          <ol className="flex flex-col gap-8">
            {steps.map((s, i) => (
              <li key={s.title} className="flex gap-5.5">
                <span className="w-14 shrink-0 font-display text-[40px] leading-none font-semibold text-sea">0{i + 1}</span>
                <span className="flex flex-col gap-1.5">
                  <span className="text-[19px] font-bold">{s.title}</span>
                  <span className="leading-relaxed text-muted">{s.text}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

const moments = [
  { src: img.batur, pos: "30% 50%" },
  { src: img.terraces, pos: "80% 50%" },
  { src: img.cliff, pos: "60% 50%" },
  { src: img.beach, pos: "75% 50%" },
  { src: img.uluwatu, pos: "15% 50%" },
  { src: img.temple, pos: "50% 50%" },
];

export function GuestMoments() {
  return (
    <section aria-labelledby="moments-title" className="bg-mist px-4 py-20 sm:px-6 lg:px-16 lg:py-24">
      <div className="mx-auto flex max-w-7xl flex-col gap-10">
        <SectionHeading
          id="moments-title"
          eyebrow="Moments from our guests"
          title="Real trips, shared by real riders."
          aside={
            <a href={`https://instagram.com/${site.instagram}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-[15px] font-bold text-sea">
              <Instagram /> Tag @{site.instagram} to be featured
            </a>
          }
        />
        <ul className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-6">
          {moments.map((m, i) => (
            <li key={i} className="relative aspect-square overflow-hidden rounded-[18px]">
              <Photo src={m.src} alt="" fill sizes="(min-width: 1024px) 16vw, 50vw" position={m.pos} />
            </li>
          ))}
        </ul>
        {testimonials.length > 0 && (
          <div className="grid gap-6 lg:grid-cols-3">
            {testimonials.map((t) => (
              <figure key={t.name + t.quote.slice(0, 12)} className="flex flex-col gap-4 rounded-[20px] border border-line bg-white p-7">
                <Stars className="text-[#f5a524]" />
                <blockquote className="text-[17px] leading-relaxed">&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption className="flex flex-col">
                  <span className="font-bold">{t.name}</span>
                  <span className="text-[13px] text-muted">{t.country} · via {t.source}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function BaliGuide() {
  return (
    <section aria-labelledby="guide-title" className="px-4 py-20 sm:px-6 lg:px-16 lg:py-24">
      <div className="mx-auto flex max-w-7xl flex-col gap-12">
        <SectionHeading
          id="guide-title"
          eyebrow="Bali guide"
          title="Plan smarter with local tips."
          aside={<Link href="/guide" className="flex items-center gap-2 text-[15px] font-bold text-sea">Read the guide <ArrowRight size={18} /></Link>}
        />
        <div className="grid gap-8 lg:grid-cols-3 lg:gap-6">
          {articles.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function CtaBand() {
  return (
    <section className="relative isolate flex min-h-[420px] flex-col items-center justify-center gap-5.5 overflow-hidden px-4 py-20 text-center text-white">
      <Photo src={img.batur} alt="" fill sizes="100vw" className="-z-10 object-cover" />
      <div className="absolute inset-0 -z-10 bg-[rgb(6_28_42/0.5)]" />
      <h2 className="max-w-3xl font-display text-4xl leading-[1.05] font-semibold tracking-[-0.02em] sm:text-6xl">Your Bali trip, sorted in one chat.</h2>
      <p className="max-w-xl text-lg leading-relaxed text-white/90">Send us your dates and where you&apos;re staying. We&apos;ll put together the rides, drivers and tours that fit.</p>
      <div className="mt-2 flex flex-wrap justify-center gap-3.5">
        <a href={waLink(`Hi ${site.name}! Can you help me plan my Bali trip?`)} target="_blank" rel="noopener noreferrer" className="flex h-14 items-center gap-2.5 rounded-full bg-wa px-6.5 font-bold text-ink">
          <WhatsApp size={22} /> Chat on WhatsApp
        </a>
        <Link href="/planner" className="flex h-14 items-center rounded-full bg-white px-6.5 font-bold text-ink">Build my trip</Link>
      </div>
    </section>
  );
}
