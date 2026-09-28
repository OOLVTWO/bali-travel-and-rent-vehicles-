"use client";

import { useState } from "react";
import { Photo } from "@/components/Photo";
import { ImageIcon } from "@/components/icons";

type Item = { src: string; alt: string; position?: string };

export function TourGallery({ items }: { items: Item[] }) {
  const [index, setIndex] = useState(0);
  const current = items[index];
  return (
    <div className="flex flex-col gap-3">
      <div className="relative h-72 overflow-hidden rounded-[28px] sm:h-[460px]">
        <Photo src={current.src} alt={current.alt} fill preload sizes="(min-width: 1024px) 60vw, 100vw" position={current.position} />
        <span className="absolute right-4 bottom-4 flex items-center gap-1.5 rounded-full bg-[rgb(6_28_42/0.62)] px-3 py-1.5 text-[13px] font-semibold text-white">
          <ImageIcon size={15} /> {index + 1} / {items.length}
        </span>
      </div>
      {items.length > 1 && (
        <ul className="flex gap-2.5 overflow-x-auto pb-1" aria-label="Photos">
          {items.map((it, i) => (
            <li key={i} className="shrink-0">
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show photo ${i + 1}: ${it.alt}`}
                aria-current={i === index}
                className={`relative block h-18 w-26 overflow-hidden rounded-xl ${i === index ? "ring-[3px] ring-sea" : "opacity-80 hover:opacity-100"}`}
              >
                <Photo src={it.src} alt="" fill sizes="104px" position={it.position} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
