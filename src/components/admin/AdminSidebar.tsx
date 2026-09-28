"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { site } from "@/data/site";
import { signOut } from "@/app/admin/auth-actions";
import { Calendar, Car, Chart, Compass, FileText, Gear, Gift, Grid, ImageIcon, LogoMark, Menu, Star, Tag, Ticket, User, Users, X } from "@/components/icons";

type Item = { label: string; href?: string; Icon: typeof Grid; badge?: "pending" };

const groups: { title: string; items: Item[] }[] = [
  {
    title: "Operasional",
    items: [
      { label: "Dashboard", href: "/admin", Icon: Grid },
      { label: "Booking", href: "/admin/bookings", Icon: Ticket, badge: "pending" },
      { label: "Kalender armada", href: "/admin/schedule", Icon: Calendar },
      { label: "Armada", href: "/admin/fleet", Icon: Car },
      { label: "Driver & guide", Icon: Users },
    ],
  },
  {
    title: "Produk",
    items: [
      { label: "Paket tour", href: "/admin/tours", Icon: Compass },
      { label: "Paket hemat", Icon: Gift },
      { label: "Harga & promo", Icon: Tag },
    ],
  },
  {
    title: "Website",
    items: [
      { label: "Konten & foto", href: "/admin/content", Icon: ImageIcon },
      { label: "Artikel", Icon: FileText },
      { label: "Ulasan tamu", Icon: Star },
    ],
  },
  {
    title: "Lainnya",
    items: [
      { label: "Pelanggan", Icon: User },
      { label: "Laporan keuangan", Icon: Chart },
      { label: "Pengaturan", Icon: Gear },
    ],
  },
];

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

export function AdminSidebar({ email, pending }: { email: string; pending: number }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  const nav = (
    <nav aria-label="Admin" className="flex flex-col gap-5 text-sm font-semibold">
      {groups.map((g) => (
        <div key={g.title} className="flex flex-col gap-0.5">
          <span className="px-3 pb-1.5 text-[11px] font-bold tracking-[0.12em] text-sidebar-label uppercase">{g.title}</span>
          {g.items.map(({ label, href, Icon, badge }) =>
            href ? (
              <Link
                key={label}
                href={href}
                aria-current={isActive(pathname, href) ? "page" : undefined}
                className={`flex h-10 items-center gap-3 rounded-[10px] px-3 ${isActive(pathname, href) ? "bg-white/10 text-white" : "text-sidebar-text hover:bg-white/5 hover:text-white"}`}
              >
                <Icon size={18} />
                <span className="flex-1">{label}</span>
                {badge === "pending" && pending > 0 ? <span className="flex h-5.5 min-w-5.5 items-center justify-center rounded-full bg-sun px-1.5 text-xs font-bold text-ink">{pending}</span> : null}
              </Link>
            ) : (
              <span key={label} className="flex h-10 items-center gap-3 rounded-[10px] px-3 text-sidebar-text/60" aria-disabled="true">
                <Icon size={18} />
                <span className="flex-1">{label}</span>
                <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] font-bold tracking-wide uppercase">Segera</span>
              </span>
            ),
          )}
        </div>
      ))}
    </nav>
  );

  const brand = (
    <Link href="/admin" className="flex items-center gap-2.5 px-2 text-white">
      <LogoMark size={28} />
      <span className="font-display text-[22px] font-semibold">{site.shortName}</span>
      <span className="rounded-md bg-sun/20 px-2 py-0.5 text-[11px] font-bold text-sun">ADMIN</span>
    </Link>
  );

  const account = (
    <div className="mt-auto flex items-center gap-3 rounded-xl bg-white/5 p-3">
      <span className="flex h-9.5 w-9.5 shrink-0 items-center justify-center rounded-full bg-sun font-bold text-ink uppercase">{email.charAt(0)}</span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-bold text-white" title={email}>{email}</span>
        <span className="text-xs text-sidebar-text">Admin</span>
      </span>
      <form action={signOut}>
        <button type="submit" className="h-9 rounded-lg px-2.5 text-xs font-bold text-sidebar-text hover:bg-white/10 hover:text-white">Keluar</button>
      </form>
    </div>
  );

  return (
    <>
      <div className="sticky top-0 z-30 flex h-14 items-center justify-between bg-deep px-4 lg:hidden">
        {brand}
        <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="admin-drawer" aria-label={open ? "Tutup menu" : "Buka menu"} className="flex h-11 w-11 items-center justify-center rounded-lg text-white">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <div id="admin-drawer" className="fixed inset-x-0 top-14 bottom-0 z-30 flex flex-col gap-6 overflow-y-auto bg-deep px-4 py-5 lg:hidden">
          {nav}
          {account}
        </div>
      )}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col gap-6 overflow-y-auto bg-deep px-4 py-6 lg:flex">
        {brand}
        {nav}
        {account}
      </aside>
    </>
  );
}
