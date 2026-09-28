import type { Metadata } from "next";
import Link from "next/link";
import { tours } from "@/data/tours";
import { vehicles } from "@/data/vehicles";
import { Photo } from "@/components/Photo";
import { Card, PageTitle, StatusChip } from "@/components/admin/ui";
import { HeroSlidesEditor } from "@/components/admin/HeroSlidesEditor";

export const metadata: Metadata = { title: "Konten & foto" };

export default function ContentPage() {
  return (
    <>
      <PageTitle title="Konten & foto" subtitle="Ganti foto website sendiri, tanpa developer" />
      <Card title="Foto header homepage" subtitle="Foto pertama tampil paling dulu. Bisa sampai 5 foto (slideshow).">
        <HeroSlidesEditor />
      </Card>
      <Card title="Foto paket tour" subtitle="Tiap paket idealnya punya minimal 6 foto.">
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {tours.map((t) => (
            <li key={t.slug} className="flex items-center gap-3.5 rounded-xl border border-line-soft p-3">
              <span className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg">
                <Photo src={t.image} alt="" fill sizes="80px" />
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="truncate text-sm font-bold">{t.title}</span>
                {t.gallery.length < 6 ? <StatusChip level="warn">{t.gallery.length} foto, kurang</StatusChip> : <StatusChip level="good">{t.gallery.length} foto</StatusChip>}
              </span>
              <Link href={`/admin/tours/${t.slug}`} className="flex h-10 items-center rounded-lg border border-ink px-3 text-[13px] font-bold">Kelola</Link>
            </li>
          ))}
        </ul>
      </Card>
      <Card title="Foto armada" subtitle="Pakai foto unit asli: tampak samping, latar polos.">
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {vehicles.map((v) => (
            <li key={v.slug} className="flex flex-col gap-2.5 rounded-xl border border-line-soft p-3">
              <span className={`relative h-28 overflow-hidden rounded-lg ${v.tint}`}>
                <Photo src={v.image} alt="" fill sizes="240px" className="object-contain p-2" />
              </span>
              <span className="text-sm font-bold">{v.name}</span>
              <StatusChip level="warn">Masih ilustrasi</StatusChip>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
