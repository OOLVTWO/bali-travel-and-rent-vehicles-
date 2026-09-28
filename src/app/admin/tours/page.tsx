import type { Metadata } from "next";
import Link from "next/link";
import { tours } from "@/data/tours";
import { Photo } from "@/components/Photo";
import { Card, PageTitle, StatusChip } from "@/components/admin/ui";
import { rupiah } from "@/lib/format";

export const metadata: Metadata = { title: "Paket tour" };

export default function AdminToursPage() {
  return (
    <>
      <PageTitle title="Paket tour" subtitle={`${tours.length} paket aktif di website`} />
      <Card>
        <ul className="flex flex-col">
          {tours.map((t, i) => (
            <li key={t.slug} className={`flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:gap-5 ${i < tours.length - 1 ? "border-b border-line-soft" : ""}`}>
              <span className="relative h-20 w-full shrink-0 overflow-hidden rounded-xl sm:w-32">
                <Photo src={t.image} alt="" fill sizes="128px" />
              </span>
              <span className="flex flex-1 flex-col gap-1">
                <span className="font-bold">{t.title}</span>
                <span className="text-[13px] text-muted">{t.area} · {t.duration} · {t.gallery.length} foto · mulai {rupiah(t.priceFrom)}</span>
              </span>
              <span className="flex items-center gap-3">
                {t.gallery.length < 6 ? <StatusChip level="warn">Foto kurang</StatusChip> : <StatusChip level="good">Lengkap</StatusChip>}
                <Link href={`/admin/tours/${t.slug}`} className="flex h-10 items-center rounded-xl border border-ink px-4 text-sm font-bold">Edit</Link>
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
