"use client";

import Link from "next/link";
import { useState } from "react";
import type { Vehicle } from "@/data/vehicles";
import { VehicleCard } from "@/components/cards";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ArrowRight } from "@/components/icons";

export function FleetSection({ vehicles }: { vehicles: Vehicle[] }) {
  const [mode, setMode] = useState<"self" | "driver">("self");
  const list = mode === "driver" ? vehicles.filter((v) => v.priceWithDriver !== null) : vehicles;

  const seg = (active: boolean) =>
    `h-11 rounded-full px-5 text-sm ${active ? "bg-white font-bold text-ink shadow-sm" : "font-semibold text-muted"}`;

  return (
    <section aria-labelledby="fleet-title" className="bg-mist px-4 py-20 sm:px-6 lg:px-16 lg:py-24">
      <div className="mx-auto flex max-w-7xl flex-col gap-12">
        <SectionHeading
          id="fleet-title"
          eyebrow="Our fleet"
          title="Well-kept rides. Real photos. No surprises."
          aside={
            <div className="flex flex-wrap items-center gap-5">
              <div role="group" aria-label="Rental type" className="flex rounded-full bg-sea-soft p-1">
                <button type="button" aria-pressed={mode === "self"} onClick={() => setMode("self")} className={seg(mode === "self")}>Self drive</button>
                <button type="button" aria-pressed={mode === "driver"} onClick={() => setMode("driver")} className={seg(mode === "driver")}>With driver</button>
              </div>
              <Link href={mode === "driver" ? "/rentals?mode=driver" : "/rentals"} className="flex items-center gap-2 text-[15px] font-bold text-sea">
                Full fleet <ArrowRight size={18} />
              </Link>
            </div>
          }
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((v) => (
            <VehicleCard key={v.slug} vehicle={v} mode={mode} query={mode === "driver" ? "?mode=driver" : ""} />
          ))}
        </div>
      </div>
    </section>
  );
}
