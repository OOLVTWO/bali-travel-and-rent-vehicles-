"use client";

import { usePathname } from "next/navigation";
import { site } from "@/data/site";
import { waLink } from "@/lib/whatsapp";
import { WhatsApp } from "@/components/icons";

export function WhatsAppFab() {
  const pathname = usePathname();
  // Halaman detail tour punya bar booking yang nempel di bawah, jadi tombolnya dinaikin
  const lifted = /^\/tours\/[^/]+$/.test(pathname);
  return (
    <a
      href={waLink(`Hi ${site.name}! I have a question about my trip.`)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className={`fixed right-4 z-40 ${lifted ? "bottom-[calc(6rem+env(safe-area-inset-bottom,0px))]" : "bottom-[calc(1rem+env(safe-area-inset-bottom,0px))]"} flex h-14 w-14 items-center justify-center rounded-full bg-wa text-ink shadow-[0_10px_24px_rgb(6_28_42/0.25)] sm:hidden`}
    >
      <WhatsApp size={26} />
    </a>
  );
}
