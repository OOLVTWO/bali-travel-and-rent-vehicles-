import type { Level } from "@/components/admin/ui";

export const bookingStatuses = ["baru", "menunggu-dp", "dikonfirmasi", "berjalan", "selesai", "batal"] as const;
export type BookingStatus = (typeof bookingStatuses)[number];

export const statusLabel: Record<BookingStatus, string> = {
  baru: "Baru",
  "menunggu-dp": "Menunggu DP",
  dikonfirmasi: "Dikonfirmasi",
  berjalan: "Berjalan",
  selesai: "Selesai",
  batal: "Batal",
};

export const statusLevel: Record<BookingStatus, Level> = {
  baru: "bad",
  "menunggu-dp": "warn",
  dikonfirmasi: "info",
  berjalan: "good",
  selesai: "neutral",
  batal: "neutral",
};

export const bookingKinds = ["rental", "driver", "tour", "combo", "transfer"] as const;
export type BookingKind = (typeof bookingKinds)[number];

export const kindLabel: Record<BookingKind, string> = {
  rental: "Rental",
  driver: "Mobil + driver",
  tour: "Tour",
  combo: "Paket hemat",
  transfer: "Airport transfer",
};

export const channels = ["website", "whatsapp", "instagram", "walk-in"] as const;
export const channelLabel: Record<(typeof channels)[number], string> = {
  website: "Website",
  whatsapp: "WhatsApp",
  instagram: "Instagram",
  "walk-in": "Datang langsung",
};

export const unitStatuses = ["tersedia", "servis", "nonaktif"] as const;
export const unitStatusLabel: Record<(typeof unitStatuses)[number], string> = {
  tersedia: "Tersedia",
  servis: "Servis",
  nonaktif: "Nonaktif",
};

export function asStatus(v: string): BookingStatus {
  return (bookingStatuses as readonly string[]).includes(v) ? (v as BookingStatus) : "baru";
}

export function asKind(v: string): BookingKind {
  return (bookingKinds as readonly string[]).includes(v) ? (v as BookingKind) : "rental";
}

/** Status yang dihitung sebagai pendapatan */
export const revenueStatuses: BookingStatus[] = ["dikonfirmasi", "berjalan", "selesai"];
