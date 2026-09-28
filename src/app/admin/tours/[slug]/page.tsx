import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTour, tours } from "@/data/tours";
import { TourEditor } from "@/components/admin/TourEditor";
import { ChevronRight } from "@/components/icons";

export function generateStaticParams() {
  return tours.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps<"/admin/tours/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const t = getTour(slug);
  return { title: t ? `Edit ${t.title}` : "Edit paket tour" };
}

export default async function EditTourPage({ params }: PageProps<"/admin/tours/[slug]">) {
  const { slug } = await params;
  const tour = getTour(slug);
  if (!tour) notFound();
  return (
    <>
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-[13px] text-muted">
        <Link href="/admin/content" className="hover:text-ink">Konten & foto</Link>
        <ChevronRight size={14} />
        <Link href="/admin/tours" className="hover:text-ink">Paket tour</Link>
        <ChevronRight size={14} />
        <span className="font-semibold text-ink">{tour.title}</span>
      </nav>
      <TourEditor tour={tour} />
    </>
  );
}
