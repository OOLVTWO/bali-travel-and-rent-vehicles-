"use client";

import { useEffect, useState } from "react";
import { Photo } from "@/components/Photo";
import type { Slide } from "@/lib/content";

/** Foto header yang ganti pelan-pelan tiap 7 detik. Diam kalau pengunjung minta gerakan minimal. */
export function HeroSlides({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => setIndex((i) => (i + 1) % slides.length), 7000);
    return () => window.clearInterval(t);
  }, [slides.length]);

  return (
    <div className="absolute inset-0 -z-10">
      {slides.map((s, i) => (
        <div key={s.src + i} className={`absolute inset-0 transition-opacity duration-1000 ${i === index ? "opacity-100" : "opacity-0"}`} aria-hidden={i !== index}>
          <Photo src={s.src} alt={i === 0 ? s.alt : ""} fill preload={i === 0} sizes="100vw" className="object-cover" position={s.position} />
        </div>
      ))}
    </div>
  );
}
