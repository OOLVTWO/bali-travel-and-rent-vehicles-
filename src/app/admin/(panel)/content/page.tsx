import type { Metadata } from "next";
import Link from "next/link";
import { Photo } from "@/components/Photo";
import { Card, PageTitle, StatusChip } from "@/components/admin/ui";
import { HeroSlidesEditor } from "@/components/admin/HeroSlidesEditor";
import { VehiclePhotoUpload } from "@/components/admin/VehiclePhotoUpload";
import { img } from "@/data/images";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Konten & foto" };

const isUploaded = (url: string | null | undefined) => Boolean(url && url.includes("/storage/v1/object/public/"));

export default async function ContentPage() {
  const supabase = await createClient();
  const [heroRes, toursRes, photosRes, vehiclesRes] = await Promise.all([
    supabase.from("photos").select("*").eq("scope", "hero").order("sort"),
    supabase.from("tours").select("id, slug, title").order("sort"),
    supabase.from("photos").select("tour_id, url, position").eq("scope", "tour").order("sort"),
    supabase.from("vehicles").select("id, slug, name, category, tint, image_url").order("sort"),
  ]);
  for (const res of [heroRes, toursRes, photosRes, vehiclesRes]) if (res.error) throw new Error(res.error.message);
  const tourPhotos = photosRes.data ?? [];
  const vehicles = vehiclesRes.data ?? [];

  const hero = (heroRes.data ?? []).map((p) => ({ id: p.id, src: p.url, alt: p.alt, position: p.position ?? undefined, storagePath: p.storage_path }));
  const tours = (toursRes.data ?? []).map((t) => {
    const mine = tourPhotos.filter((p) => p.tour_id === t.id);
    return { ...t, count: mine.length, cover: mine[0] };
  });

  return (
    <>
      <PageTitle title="Konten & foto" subtitle="Ganti foto website sendiri, tanpa developer" />
      <Card title="Foto header homepage" subtitle="Foto pertama tampil paling dulu. Bisa sampai 5 foto (slideshow). Pakai foto landscape.">
        <HeroSlidesEditor initial={hero} />
      </Card>
      <Card title="Foto paket tour" subtitle="Tiap paket idealnya punya minimal 6 foto.">
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {tours.map((t) => (
            <li key={t.slug} className="flex items-center gap-3.5 rounded-xl border border-line-soft p-3">
              <span className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-mist">
                {t.cover && <Photo src={t.cover.url} alt="" fill sizes="80px" position={t.cover.position ?? undefined} />}
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="truncate text-sm font-bold">{t.title}</span>
                {t.count < 6 ? <StatusChip level="warn">{t.count} foto, kurang</StatusChip> : <StatusChip level="good">{t.count} foto</StatusChip>}
              </span>
              <Link href={`/admin/tours/${t.slug}`} className="flex h-10 items-center rounded-lg border border-ink px-3 text-[13px] font-bold">Kelola</Link>
            </li>
          ))}
        </ul>
      </Card>
      <Card title="Foto armada" subtitle="Pakai foto unit asli: tampak samping, latar polos (PNG transparan paling bagus).">
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {vehicles.map((v) => (
            <li key={v.slug} className="flex flex-col gap-2.5 rounded-xl border border-line-soft p-3">
              <span className={`relative h-28 overflow-hidden rounded-lg ${v.tint}`}>
                <Photo src={v.image_url || (v.category === "car" ? img.carSilver : img.scooterCream)} alt="" fill sizes="240px" className="object-contain p-2" />
              </span>
              <span className="flex items-center justify-between gap-2">
                <span className="text-sm font-bold">{v.name}</span>
                {isUploaded(v.image_url) ? <StatusChip level="good">Foto asli</StatusChip> : <StatusChip level="warn">Masih ilustrasi</StatusChip>}
              </span>
              <VehiclePhotoUpload vehicleId={v.id} name={v.name} />
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
