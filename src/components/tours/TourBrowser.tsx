"use client";

import { useState } from "react";
import { tourCategories, type Tour, type TourCategory } from "@/data/tours";
import { TourCard } from "@/components/cards";

export function TourBrowser({ tours, initial }: { tours: Tour[]; initial: TourCategory | "all" }) {
  const [filter, setFilter] = useState<TourCategory | "all">(initial);
  const list = filter === "all" ? tours : tours.filter((t) => t.categories.includes(filter));
  const chip = (active: boolean) =>
    `h-11 shrink-0 rounded-full px-4.5 text-sm ${active ? "bg-ink font-bold text-white" : "border border-line bg-white font-semibold hover:bg-mist"}`;
  return (
    <div className="flex flex-col gap-8">
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Filter tours">
        <button type="button" aria-pressed={filter === "all"} onClick={() => setFilter("all")} className={chip(filter === "all")}>All</button>
        {tourCategories.map((c) => (
          <button key={c.id} type="button" aria-pressed={filter === c.id} onClick={() => setFilter(c.id)} className={chip(filter === c.id)}>
            {c.label}
          </button>
        ))}
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((t) => (
          <TourCard key={t.slug} tour={t} />
        ))}
      </div>
    </div>
  );
}
