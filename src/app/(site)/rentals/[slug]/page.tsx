import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getVehicle, getVehicles } from "@/lib/content";
import { Photo } from "@/components/Photo";
import { BookingForm } from "@/components/BookingForm";
import { ArrowLeft, Check } from "@/components/icons";
import { rupiah } from "@/lib/format";

export async function generateStaticParams() {
  const vehicles = await getVehicles();
  return vehicles.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: PageProps<"/rentals/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const v = await getVehicle(slug);
  return v ? { title: `${v.name} rental`, description: `${v.name} (${v.subtitle}) delivered to your villa in Bali.` } : {};
}

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function VehiclePage({ params, searchParams }: PageProps<"/rentals/[slug]">) {
  const { slug } = await params;
  const sp = await searchParams;
  const vehicle = await getVehicle(slug);
  if (!vehicle) notFound();

  const canSelf = vehicle.pricePerDay !== null;
  const canDriver = vehicle.priceWithDriver !== null;
  const mode = (one(sp.mode) === "driver" && canDriver) || !canSelf ? "driver" : "self";
  const price = mode === "driver" ? vehicle.priceWithDriver : vehicle.pricePerDay;
  const keep = new URLSearchParams();
  for (const k of ["from", "to", "area"] as const) {
    const v = one(sp[k]);
    if (v) keep.set(k, v);
  }
  const modeHref = (m: "self" | "driver") => {
    const q = new URLSearchParams(keep);
    if (m === "driver") q.set("mode", "driver");
    const s = q.toString();
    return `/rentals/${vehicle.slug}${s ? `?${s}` : ""}`;
  };

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-16 lg:py-14">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <Link href="/rentals" className="flex items-center gap-2 self-start text-sm font-bold text-sea">
          <ArrowLeft size={18} /> All vehicles
        </Link>
        <div className="grid gap-10 lg:grid-cols-[1fr_420px]">
          <div className="flex flex-col gap-8">
            <div className={`relative flex h-72 items-center justify-center rounded-[28px] sm:h-[420px] ${vehicle.tint}`}>
              <Photo src={vehicle.image} alt={vehicle.name} width={640} height={427} preload className="h-[85%] w-[85%] object-contain" />
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-sm font-semibold text-muted">{vehicle.subtitle}</span>
              <h1 className="font-display text-4xl font-semibold tracking-[-0.015em] sm:text-5xl">{vehicle.name}</h1>
              {price !== null && (
                <p className="text-lg">
                  <span className="text-2xl font-bold">{rupiah(price)}</span>
                  <span className="text-muted"> {mode === "driver" ? "per day with driver (10 h)" : "per day"}</span>
                </p>
              )}
            </div>
            {canSelf && canDriver && (
              <nav aria-label="Rental type" className="flex self-start rounded-full bg-sea-soft p-1">
                <Link href={modeHref("self")} aria-current={mode === "self" ? "page" : undefined} className={`flex h-11 items-center rounded-full px-5 text-sm ${mode === "self" ? "bg-white font-bold shadow-sm" : "font-semibold text-muted"}`}>
                  Self drive
                </Link>
                <Link href={modeHref("driver")} aria-current={mode === "driver" ? "page" : undefined} className={`flex h-11 items-center rounded-full px-5 text-sm ${mode === "driver" ? "bg-white font-bold shadow-sm" : "font-semibold text-muted"}`}>
                  With driver
                </Link>
              </nav>
            )}
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-bold">What&apos;s included</h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {vehicle.included.map((i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[15px]"><Check size={18} className="mt-0.5 shrink-0 text-sea" />{i}</li>
                ))}
              </ul>
            </div>
            {mode === "self" && (
              <div className="rounded-2xl bg-sun-soft p-5 text-[15px] leading-relaxed text-body">
                <strong className="text-ink">Riding yourself?</strong> Bring your home licence and an International Driving Permit that covers {vehicle.category === "scooter" ? "motorcycles" : "cars"}.{" "}
                <Link href="/guide/driving-licence-bali" className="font-bold text-sea underline">Read why it matters</Link>.
              </div>
            )}
          </div>
          <aside id="book" aria-labelledby="book-title" className="flex flex-col gap-5 self-start rounded-[24px] border border-line p-6 lg:sticky lg:top-24">
            <h2 id="book-title" className="font-display text-2xl font-semibold">Book this {vehicle.category === "scooter" ? "scooter" : "car"}</h2>
            <BookingForm
              kind={mode === "driver" ? "driver" : "rental"}
              vehicleSlug={vehicle.slug}
              title={`${vehicle.name}${mode === "driver" ? " with driver" : ""}`}
              unitPrice={price}
              defaults={{ from: one(sp.from), to: one(sp.to), area: one(sp.area) }}
            />
          </aside>
        </div>
      </div>
    </section>
  );
}
