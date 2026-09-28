import type { Metadata } from "next";
import Link from "next/link";
import { Photo } from "@/components/Photo";
import { Card, PageTitle, StatusChip } from "@/components/admin/ui";
import { rupiah } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Paket tour" };

export default async function AdminToursPage() {
  const supabase = await createClient();
  const [toursRes, photosRes] = await Promise.all([
    supabase.from("tours").select("id, slug, title, area, duration, price_from, active, featured").order("sort"),
    supabase.from("photos").select("tour_id, url, position").eq("scope", "tour").order("sort"),
  ]);
  if (toursRes.error) throw new Error(toursRes.error.message);
  const photos = photosRes.data ?? [];
  const tours = toursRes.data.map((t) => {
    const mine = photos.filter((p) => p.tour_id === t.id);
    return { ...t, count: mine.length, cover: mine[0] };
  });
  const activeCount = tours.filter((t) => t.active).length;

  return (
    <>
      <PageTitle title="Paket tour" subtitle={`${activeCount} dari ${tours.length} paket tampil di website`} />
      <Card>
        <ul className="flex flex-col">
          {tours.map((t, i) => (
            <li key={t.slug} className={`flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:gap-5 ${i < tours.length - 1 ? "border-b border-line-soft" : ""}`}>
              <span className="relative h-20 w-full shrink-0 overflow-hidden rounded-xl bg-mist sm:w-32">
                {t.cover && <Photo src={t.cover.url} alt="" fill sizes="128px" position={t.cover.position ?? undefined} />}
              </span>
              <span className="flex flex-1 flex-col gap-1">
                <span className="font-bold">{t.title}</span>
                <span className="text-[13px] text-muted">{t.area} · {t.duration} · {t.count} foto · mulai {rupiah(t.price_from)}</span>
              </span>
              <span className="flex flex-wrap items-center gap-2">
                {!t.active && <StatusChip level="neutral">Nonaktif</StatusChip>}
                {t.featured && t.active && <StatusChip level="info">Di homepage</StatusChip>}
                {t.count < 6 ? <StatusChip level="warn">Foto kurang</StatusChip> : <StatusChip level="good">Lengkap</StatusChip>}
                <Link href={`/admin/tours/${t.slug}`} className="flex h-10 items-center rounded-xl border border-ink px-4 text-sm font-bold">Edit</Link>
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
