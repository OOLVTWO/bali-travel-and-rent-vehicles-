import type { Metadata } from "next";
import { site } from "@/data/site";

// Gambar preview umum (src/app/opengraph-image.tsx). Halaman detail tour, rental & artikel punya
// `opengraph-image` sendiri di foldernya, jadi mereka manggil pageMeta dengan `ownImage: true`.
const defaultImage = { url: "/opengraph-image", width: 1200, height: 630, alt: `${site.name}: scooter & car rental, private drivers and tours in Bali` };

/** Metadata halaman publik: judul, deskripsi, URL kanonik, dan preview saat link dibagikan (WA, IG, FB, X). */
export function pageMeta({ title, description, path, ownImage = false }: { title?: string; description: string; path: string; ownImage?: boolean }): Metadata {
  const shareTitle = title ? `${title} · ${site.name}` : `${site.name} · Scooters, cars, drivers & tours in Bali`;
  // Key `images` harus benar-benar gak ada (bukan undefined) biar gambar dari file opengraph-image yang dipakai.
  const withImage = ownImage ? {} : { images: [defaultImage] };
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", siteName: site.name, locale: "en_US", url: path, title: shareTitle, description, ...withImage },
    twitter: { card: "summary_large_image", title: shareTitle, description, ...withImage },
  };
}
