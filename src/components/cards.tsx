import Link from "next/link";
import { Photo } from "@/components/Photo";
import { ArrowRight, Check, Heart, StarFilled, Users } from "@/components/icons";
import type { Vehicle } from "@/data/vehicles";
import type { Tour } from "@/data/tours";
import type { Combo } from "@/data/combos";
import type { Article } from "@/data/articles";
import { rupiah } from "@/lib/format";

export function VehicleCard({ vehicle, mode = "self", query = "" }: { vehicle: Vehicle; mode?: "self" | "driver"; query?: string }) {
  const price = mode === "driver" ? vehicle.priceWithDriver : vehicle.pricePerDay ?? vehicle.priceWithDriver;
  const withDriverOnly = vehicle.pricePerDay === null;
  const href = `/rentals/${vehicle.slug}${query}`;
  return (
    <article className="flex flex-col overflow-hidden rounded-[22px] border border-line bg-white">
      <div className={`relative flex h-52 items-center justify-center ${vehicle.tint}`}>
        <Photo src={vehicle.image} alt={vehicle.name} width={320} height={214} className="h-[88%] w-[88%] object-contain" />
        {vehicle.badge && (
          <span className={`absolute top-4 left-4 rounded-full px-2.5 py-1.5 text-xs font-bold ${vehicle.badge === "With driver" ? "bg-sea text-white" : "bg-sun text-ink"}`}>
            {vehicle.badge}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3.5 p-5.5">
        <div className="flex flex-col gap-1">
          <h3 className="text-xl font-bold">
            <Link href={href} className="hover:underline">{vehicle.name}</Link>
          </h3>
          <span className="text-sm text-muted">{vehicle.subtitle}</span>
        </div>
        <div className="flex flex-wrap gap-4 text-[13px] font-semibold text-body">
          {vehicle.highlights.map((h) => (
            <span key={h} className="flex items-center gap-1.5"><Users size={16} />{h}</span>
          ))}
        </div>
        <div className="mt-auto h-px bg-line-soft" />
        <div className="flex items-center justify-between gap-3">
          {price !== null ? (
            <span className="flex items-baseline gap-1">
              <span className="text-xl font-bold">{rupiah(price)}</span>
              <span className="text-sm text-muted">{mode === "driver" || withDriverOnly ? "/ 10 h" : "/ day"}</span>
            </span>
          ) : (
            <span className="text-sm font-semibold text-muted">Self drive only</span>
          )}
          <Link href={href} className="flex h-11 items-center rounded-xl bg-ink px-4.5 text-sm font-bold text-white hover:bg-deep">
            Book
          </Link>
        </div>
      </div>
    </article>
  );
}

export function WayCard({ href, image, tag, title, text, price }: { href: string; image: string; tag: string; title: string; text: string; price: string }) {
  return (
    <Link href={href} className="group relative block h-[440px] overflow-hidden rounded-[26px] text-white sm:h-[540px]">
      <Photo src={image} alt="" fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
      <div className="scrim-bottom absolute inset-0" />
      <div className="absolute inset-x-8 bottom-8 flex flex-col gap-3">
        <span className="self-start rounded-full bg-white/20 px-3 py-1.5 text-[13px] font-bold tracking-wide">{tag}</span>
        <span className="font-display text-4xl leading-tight font-semibold">{title}</span>
        <span className="leading-relaxed text-white/90">{text}</span>
        <span className="mt-2 flex items-center justify-between font-bold">
          {price}
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink"><ArrowRight /></span>
        </span>
      </div>
    </Link>
  );
}

export function TourTile({ tour, big = false }: { tour: Tour; big?: boolean }) {
  return (
    <Link
      href={`/tours/${tour.slug}`}
      className={`group relative block overflow-hidden rounded-3xl text-white ${big ? "min-h-[360px] sm:col-span-2 sm:row-span-2" : "min-h-[240px]"}`}
    >
      <Photo src={tour.image} alt="" fill sizes={big ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"} position={tour.imagePosition} className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
      <div className="scrim-bottom absolute inset-0" />
      {tour.badge && <span className="absolute top-5 left-5 rounded-full bg-sun px-3 py-1.5 text-[13px] font-bold text-ink">{tour.badge}</span>}
      <span className="absolute top-5 right-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-ink" aria-hidden="true"><Heart /></span>
      <div className={`absolute flex flex-col gap-1.5 ${big ? "inset-x-8 bottom-8" : "inset-x-5.5 bottom-5.5"}`}>
        <span className="text-sm font-semibold text-white/85">{tour.duration} · {tour.pickup}</span>
        <span className={`font-display leading-[1.08] font-semibold ${big ? "text-4xl sm:text-[44px]" : "text-[25px]"}`}>{tour.title}</span>
        <span className="text-sm font-bold">from {rupiah(tour.priceFrom)}{big ? " / person" : ""}</span>
      </div>
    </Link>
  );
}

export function TourCard({ tour }: { tour: Tour }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-3xl border border-line bg-white">
      <div className="relative h-56">
        <Photo src={tour.image} alt="" fill sizes="(min-width: 1024px) 33vw, 100vw" position={tour.imagePosition} />
        {tour.badge && <span className="absolute top-4 left-4 rounded-full bg-sun px-3 py-1.5 text-xs font-bold text-ink">{tour.badge}</span>}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <span className="text-[13px] font-semibold text-muted">{tour.area} · {tour.duration}</span>
        <h3 className="font-display text-2xl leading-tight font-semibold">
          <Link href={`/tours/${tour.slug}`} className="hover:underline">{tour.title}</Link>
        </h3>
        <p className="text-[15px] leading-relaxed text-body">{tour.summary}</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-bold">from {rupiah(tour.priceFrom)}</span>
          <Link href={`/tours/${tour.slug}`} className="flex h-11 items-center rounded-xl border border-ink px-4 text-sm font-bold">See tour</Link>
        </div>
      </div>
    </article>
  );
}

export function ComboCard({ combo }: { combo: Combo }) {
  return (
    <article id={combo.slug} className="flex scroll-mt-24 flex-col overflow-hidden rounded-3xl border border-line bg-white">
      <div className="relative h-56">
        <Photo src={combo.image} alt="" fill sizes="(min-width: 1024px) 33vw, 100vw" />
        <span className="absolute top-4.5 left-4.5 rounded-full bg-white px-3 py-1.5 text-[13px] font-bold">{combo.tag}</span>
      </div>
      <div className="flex flex-1 flex-col gap-4.5 p-7">
        <div className="flex flex-col gap-1">
          <h3 className="font-display text-[28px] font-semibold">{combo.name}</h3>
          <span className="text-sm text-muted">{combo.subtitle}</span>
        </div>
        <ul className="flex flex-col gap-2.5 text-[15px]">
          {combo.includes.map((i) => (
            <li key={i} className="flex items-start gap-2.5"><Check size={18} className="mt-0.5 shrink-0 text-sea" />{i}</li>
          ))}
        </ul>
        <div className="mt-auto h-px bg-line-soft" />
        <div className="flex items-center justify-between">
          <span className="text-[22px] font-bold">{rupiah(combo.price)}</span>
          <Link href={`/deals#${combo.slug}`} className="flex h-11 items-center rounded-xl border border-ink px-4.5 text-sm font-bold">See details</Link>
        </div>
      </div>
    </article>
  );
}

export function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="flex flex-col gap-3.5">
      <div className="relative h-60 overflow-hidden rounded-[20px]">
        <Photo src={article.image} alt="" fill sizes="(min-width: 1024px) 33vw, 100vw" position={article.imagePosition} />
      </div>
      <span className="text-xs font-bold tracking-[0.1em] text-sea uppercase">{article.category}</span>
      <h3 className="text-[22px] leading-snug font-bold">
        <Link href={`/guide/${article.slug}`} className="hover:underline">{article.title}</Link>
      </h3>
      <span className="text-sm text-muted">{article.readMinutes} min read</span>
      <Link href={article.cta.href} className="flex items-center gap-2 text-[15px] font-bold text-sea">
        {article.cta.label} <ArrowRight size={16} />
      </Link>
    </article>
  );
}

/** Bintang dekoratif; tulis nilai ratingnya sebagai teks di dekatnya. */
export function Stars({ className = "text-sun", rating = 5 }: { className?: string; rating?: number }) {
  const filled = Math.round(rating);
  return (
    <span className={`flex gap-0.5 ${className}`} aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <StarFilled key={i} size={16} className={i < filled ? undefined : "opacity-25"} />
      ))}
    </span>
  );
}
