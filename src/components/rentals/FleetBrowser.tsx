"use client";

import { useState } from "react";
import { vehicles, type VehicleCategory } from "@/data/vehicles";
import { VehicleCard } from "@/components/cards";
import { Calendar } from "@/components/icons";

type Props = {
  initialType: VehicleCategory | "all";
  initialMode: "self" | "driver";
  from?: string;
  to?: string;
  area?: string;
};

export function FleetBrowser({ initialType, initialMode, from, to, area }: Props) {
  const [type, setType] = useState<VehicleCategory | "all">(initialType);
  const [mode, setMode] = useState<"self" | "driver">(initialMode);

  const list = vehicles.filter((v) => {
    if (type !== "all" && v.category !== type) return false;
    if (mode === "driver") return v.priceWithDriver !== null;
    return true;
  });

  const q = new URLSearchParams();
  if (mode === "driver") q.set("mode", "driver");
  if (from) q.set("from", from);
  if (to) q.set("to", to);
  if (area) q.set("area", area);
  const query = q.toString() ? `?${q.toString()}` : "";

  const chip = (active: boolean) =>
    `h-11 rounded-full px-4.5 text-sm ${active ? "bg-ink font-bold text-white" : "border border-line bg-white font-semibold text-ink hover:bg-mist"}`;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Vehicle type">
          {([["all", "All"], ["scooter", "Scooters"], ["car", "Cars"]] as const).map(([id, label]) => (
            <button key={id} type="button" aria-pressed={type === id} onClick={() => setType(id)} className={chip(type === id)}>
              {label}
            </button>
          ))}
        </div>
        <div className="flex self-start rounded-full bg-sea-soft p-1" role="group" aria-label="Rental type">
          {([["self", "Self drive"], ["driver", "With driver"]] as const).map(([id, label]) => (
            <button
              key={id}
              type="button"
              aria-pressed={mode === id}
              onClick={() => setMode(id)}
              className={`h-11 rounded-full px-5 text-sm ${mode === id ? "bg-white font-bold text-ink shadow-sm" : "font-semibold text-muted"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {(from || to) && (
        <p className="flex items-center gap-2.5 rounded-xl bg-mist px-4 py-3 text-[15px] text-body">
          <Calendar size={18} className="text-sea" />
          Showing rides for {from || "?"} → {to || "?"}{area ? ` · deliver to ${area}` : ""}. Your dates carry over to the booking form.
        </p>
      )}

      {list.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((v) => (
            <VehicleCard key={v.slug} vehicle={v} mode={mode} query={query} />
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-line p-8 text-center text-muted">
          No scooters come with a driver. Switch to Cars or Self drive to see more.
        </p>
      )}
    </div>
  );
}
