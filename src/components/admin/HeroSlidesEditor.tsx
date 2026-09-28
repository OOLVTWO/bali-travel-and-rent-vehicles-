"use client";

import { useState } from "react";
import { img } from "@/data/images";
import { GalleryManager, type GalleryPhoto } from "@/components/admin/GalleryManager";

const initial: GalleryPhoto[] = [
  { id: "hero-1", src: img.hero, alt: "Rice terraces near Ubud at sunset" },
  { id: "hero-2", src: img.cliff, alt: "Kelingking Beach on Nusa Penida" },
  { id: "hero-3", src: img.batur, alt: "Sunrise from Mount Batur" },
];

export function HeroSlidesEditor() {
  const [photos, setPhotos] = useState(initial);
  return <GalleryManager photos={photos} onChange={setPhotos} max={5} firstLabel="Utama" />;
}
