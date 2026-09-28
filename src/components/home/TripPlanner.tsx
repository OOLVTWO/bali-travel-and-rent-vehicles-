"use client";

import Link from "next/link";
import { useState } from "react";
import { plannerStops } from "@/data/planner";
import type { Tour } from "@/data/tours";
import type { Vehicle } from "@/data/vehicles";
import { rupiah } from "@/lib/format";
import { Compass, MapPin, Scooter, Steering } from "@/components/icons";

type Props = { tours: Tour[]; vehicles: Vehicle[]; headingLevel?: "h1" | "h2" };

export function TripPlanner({ tours, vehicles, headingLevel = "h2" }: Props) {
  // Motor termurah buat opsi "ride yourself", mobil + driver termurah buat opsi "car + driver"
  const scooter = vehicles.filter((v) => v.category === "scooter" && v.pricePerDay !== null).sort((a, b) => (a.pricePerDay ?? 0) - (b.pricePerDay ?? 0))[0];
  const car = vehicles.filter((v) => v.category === "car" && v.priceWithDriver !== null).sort((a, b) => (a.priceWithDriver ?? 0) - (b.priceWithDriver ?? 0))[0];
  const [selected, setSelected] = useState<string[]>(["ubud", "tegallalang", "kintamani"]);
  const [pax, setPax] = useState(2);
  const H = headingLevel;

  const stops = plannerStops.filter((s) => selected.includes(s.id));
  const hours = stops.length ? Math.max(...stops.map((s) => s.rideHours)) + 0.5 * (stops.length - 1) : 0;
  const farthest = [...stops].sort((a, b) => b.rideHours - a.rideHours)[0];
  const tour = farthest ? tours.find((t) => t.slug === farthest.tourSlug) : undefined;

  const scooters = Math.ceil(pax / 2);
  const cars = Math.ceil(pax / 6);
  const selfPrice = scooter?.pricePerDay ? scooter.pricePerDay * scooters : null;
  const driverPrice = car?.priceWithDriver ? car.priceWithDriver * cars : null;
  const tourPrice = tour ? tour.priceFrom * pax : null;
  const recommended: "self" | "driver" = pax >= 3 || hours >= 3.5 ? "driver" : "self";

  function toggle(id: string) {
    setSelected((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  }

  const options = [
    {
      id: "self" as const,
      Icon: Scooter,
      title: "Ride yourself",
      text: `${scooters} ${scooters === 1 ? "scooter" : "scooters"}, route map, stop whenever you want.${hours ? ` About ${hours} h of riding.` : ""}`,
      price: selfPrice,
      href: scooter ? `/rentals/${scooter.slug}` : "/rentals",
    },
    {
      id: "driver" as const,
      Icon: Steering,
      title: "Car + driver",
      text: `Private car for 10 hours${cars > 1 ? ` (${cars} cars)` : ""}. Aircon, water and a driver who knows the shortcuts.`,
      price: driverPrice,
      href: car ? `/rentals/${car.slug}?mode=driver` : "/rentals?mode=driver",
    },
    {
      id: "tour" as const,
      Icon: Compass,
      title: "Join a tour",
      text: tour ? `${tour.title} with guide, entry tickets and more included.` : "Pick a stop to see a matching tour.",
      price: tourPrice,
      href: tour ? `/tours/${tour.slug}` : "/tours",
    },
  ];

  return (
    <div className="flex flex-col gap-10 rounded-[30px] bg-sea-dark p-6 text-white sm:p-10 lg:flex-row lg:gap-14 lg:p-14">
      <div className="flex flex-col gap-4 lg:w-[420px] lg:shrink-0">
        <span className="text-[13px] font-bold tracking-[0.16em] text-sun uppercase">Trip planner</span>
        <H className="font-display text-4xl leading-[1.08] font-semibold tracking-[-0.01em] sm:text-[44px]">Not sure how to get there? Compare in one tap.</H>
        <p className="leading-relaxed text-white/85">Pick your stops and we&apos;ll price riding yourself, hiring a driver or joining a tour, side by side.</p>
        <div className="mt-2 flex flex-wrap gap-2.5" role="group" aria-label="Stops">
          {plannerStops.map((s) => {
            const on = selected.includes(s.id);
            return (
              <button
                key={s.id}
                type="button"
                aria-pressed={on}
                onClick={() => toggle(s.id)}
                className={`flex h-10 items-center gap-2 rounded-full px-3.5 text-sm font-semibold ${on ? "bg-white text-ink" : "border border-dashed border-white/55 text-white hover:bg-white/10"}`}
              >
                <MapPin size={16} />
                {s.name}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="font-semibold" id="planner-pax">Travellers</span>
          <div className="flex items-center gap-2" role="group" aria-labelledby="planner-pax">
            <button type="button" onClick={() => setPax((p) => Math.max(1, p - 1))} aria-label="Fewer travellers" className="h-10 w-10 rounded-full bg-white/15 text-lg font-bold">−</button>
            <output className="w-6 text-center text-base font-bold tabular-nums" aria-live="polite">{pax}</output>
            <button type="button" onClick={() => setPax((p) => Math.min(12, p + 1))} aria-label="More travellers" className="h-10 w-10 rounded-full bg-white/15 text-lg font-bold">+</button>
          </div>
          <span className="text-white/80">· day trip from Canggu</span>
        </div>
      </div>
      <div className="grid flex-1 gap-4.5 sm:grid-cols-3">
        {options.map(({ id, Icon, title, text, price, href }) => {
          const rec = id === recommended && stops.length > 0;
          return (
            <div key={id} className={`relative flex flex-col gap-3.5 rounded-[20px] bg-white p-6.5 text-ink ${rec ? "ring-[3px] ring-sun" : ""}`}>
              {rec && <span className="absolute -top-3.5 left-6.5 rounded-full bg-sun px-3 py-1 text-xs font-bold">Recommended</span>}
              <span className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-sea-soft text-sea"><Icon size={24} /></span>
              <span className="text-[19px] font-bold">{title}</span>
              <span className="text-sm leading-relaxed text-muted">{text}</span>
              <span className="mt-auto flex flex-col">
                <span className="text-2xl font-bold tabular-nums">{price !== null && stops.length ? rupiah(price) : "—"}</span>
                <span className="text-[13px] text-muted">estimated total for {pax}</span>
              </span>
              <Link href={href} className={`flex h-11.5 items-center justify-center rounded-xl text-[15px] font-bold ${rec ? "bg-sun" : "border border-ink"}`}>
                Choose
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
