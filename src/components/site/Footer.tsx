import Link from "next/link";
import { site } from "@/data/site";
import { tours } from "@/data/tours";
import { LogoMark } from "@/components/icons";

export function Footer() {
  return (
    <footer className="bg-deep px-4 pt-16 pb-10 text-sidebar-text sm:px-6 lg:px-16">
      <div className="mx-auto flex max-w-7xl flex-col gap-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr_1.3fr]">
          <div className="flex flex-col gap-4">
            <span className="flex items-center gap-2.5 text-white">
              <LogoMark size={30} />
              <span className="font-display text-2xl font-semibold">{site.shortName}</span>
              <span className="text-[11px] font-bold tracking-[0.22em]">BALI</span>
            </span>
            <p className="max-w-xs text-[15px] leading-relaxed">
              Scooters, cars, drivers and day trips across Bali. Locally owned and run.
            </p>
          </div>
          <FooterCol title="Rent">
            <Link href="/rentals?type=scooter">Scooters</Link>
            <Link href="/rentals?type=car">Cars</Link>
            <Link href="/rentals?mode=driver">Car with driver</Link>
            <Link href="/deals#nomad-monthly">Monthly rental</Link>
          </FooterCol>
          <FooterCol title="Tours">
            {tours.slice(0, 4).map((t) => (
              <Link key={t.slug} href={`/tours/${t.slug}`}>
                {t.area}
              </Link>
            ))}
          </FooterCol>
          <FooterCol title="Help">
            <Link href="/guide/driving-licence-bali">Driving licence</Link>
            <Link href="/planner">Trip planner</Link>
            <Link href="/deals">Combo deals</Link>
            <Link href="/guide">Bali guide</Link>
          </FooterCol>
          <FooterCol title="Contact">
            <span>WhatsApp {site.whatsappDisplay}</span>
            <span>{site.email}</span>
            <span>{site.address}</span>
          </FooterCol>
        </div>
        <div className="flex flex-col gap-4 border-t border-sidebar-text/20 pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} {site.name}. All rights reserved.</span>
          <ul className="flex flex-wrap gap-2" aria-label="Payment methods">
            {site.paymentMethods.map((m) => (
              <li key={m} className="rounded-lg border border-sidebar-text/30 px-2.5 py-1 font-semibold">
                {m}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 text-[15px] [&_a:hover]:text-white">
      <span className="text-[13px] font-bold tracking-[0.12em] text-white uppercase">{title}</span>
      {children}
    </div>
  );
}
