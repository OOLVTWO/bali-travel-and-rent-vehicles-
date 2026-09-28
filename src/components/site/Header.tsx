"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { site } from "@/data/site";
import { waLink } from "@/lib/whatsapp";
import { LogoMark, Menu, WhatsApp, X } from "@/components/icons";

const nav = [
  { href: "/rentals", label: "Rent a vehicle" },
  { href: "/tours", label: "Tours" },
  { href: "/rentals?mode=driver", label: "Private driver" },
  { href: "/deals", label: "Combo deals" },
  { href: "/planner", label: "Trip planner" },
  { href: "/guide", label: "Bali guide" },
];

export function Header() {
  const pathname = usePathname();
  const overlay = pathname === "/";
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);

  // Tutup menu HP setiap pindah halaman
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  const text = overlay ? "text-white" : "text-ink";

  return (
    <header
      className={
        overlay
          ? "absolute inset-x-0 top-0 z-30"
          : "sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur"
      }
    >
      <div className={`mx-auto flex h-18 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-16 ${text}`}>
        <Link href="/" className="flex items-center gap-2.5" aria-label={`${site.name} home`}>
          <LogoMark size={32} light={overlay} />
          <span className="font-display text-[26px] font-semibold tracking-tight">{site.shortName}</span>
          <span className="mt-1 text-[11px] font-bold tracking-[0.22em] opacity-85">BALI</span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-7 text-[15px] font-medium lg:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="hover:opacity-80">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={waLink(`Hi ${site.name}! I have a question about my trip.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden h-11 items-center gap-2 rounded-full bg-wa px-4 text-sm font-bold text-ink sm:flex"
          >
            <WhatsApp size={20} />
            Chat on WhatsApp
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className={`flex h-11 w-11 items-center justify-center rounded-full lg:hidden ${overlay ? "bg-white/20" : "bg-mist"}`}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-menu" aria-label="Mobile" className="mx-4 rounded-2xl border border-line bg-white p-2 text-ink shadow-xl lg:hidden">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="block rounded-xl px-4 py-3 text-base font-semibold hover:bg-mist">
              {item.label}
            </Link>
          ))}
          <a
            href={waLink(`Hi ${site.name}! I have a question about my trip.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 flex items-center gap-2 rounded-xl bg-wa px-4 py-3 font-bold text-ink"
          >
            <WhatsApp size={20} />
            Chat on WhatsApp
          </a>
        </nav>
      )}
    </header>
  );
}
