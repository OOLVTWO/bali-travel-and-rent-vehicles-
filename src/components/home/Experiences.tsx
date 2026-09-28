"use client";

import Link from "next/link";
import { useState } from "react";
import { tourCategories, tours, type TourCategory } from "@/data/tours";
import { TourTile } from "@/components/cards";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ArrowRight } from "@/components/icons";

export function Experiences() {
  const [filter, setFilter] = useState<TourCategory | "all">("all");
  const list = (filter === "all" ? tours : tours.filter((t) => t.categories.includes(filter))).slice(0, 5);

  const chip = (active: boolean) =>
    `h-11 shrink-0 rounded-full px-4.5 text-sm ${active ? "bg-white font-bold text-ink" : "border border-white/35 font-semibold text-white hover:bg-white/10"}`;

  return (
    <section aria-labelledby="exp-title" className="bg-deep px-4 py-20 text-white sm:px-6 lg:px-16 lg:py-24">
      <div className="mx-auto flex max-w-7xl flex-col gap-12">
        <SectionHeading
          id="exp-title"
          dark
          eyebrow="Top experiences"
          title="Bali's best days out, with the ride sorted."
          aside={
            <div className="-mx-4 flex gap-2.5 overflow-x-auto px-4 pb-1 lg:mx-0 lg:px-0" role="group" aria-label="Filter experiences">
              <button type="button" aria-pressed={filter === "all"} onClick={() => setFilter("all")} className={chip(filter === "all")}>All</button>
              {tourCategories.map((c) => (
                <button key={c.id} type="button" aria-pressed={filter === c.id} onClick={() => setFilter(c.id)} className={chip(filter === c.id)}>
                  {c.label}
                </button>
              ))}
            </div>
          }
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[300px]">
          {list.map((t, i) => (
            <TourTile key={t.slug} tour={t} big={i === 0 && list.length >= 3} />
          ))}
        </div>
        <Link href="/tours" className="flex h-13 items-center gap-2.5 self-center rounded-full border border-white/45 px-6.5 text-[15px] font-bold hover:bg-white/10">
          See all experiences <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}
