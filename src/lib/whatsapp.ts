import { site } from "@/data/site";

/** Link WhatsApp dengan pesan yang sudah terisi. */
export function waLink(message?: string) {
  const base = `https://wa.me/${site.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Susun pesan booking yang rapi dari pasangan label & nilai. Baris kosong dilewati. */
export function bookingMessage(title: string, fields: [string, string | number | undefined | null][]) {
  const lines = fields
    .filter(([, v]) => v !== undefined && v !== null && String(v).trim() !== "")
    .map(([k, v]) => `${k}: ${v}`);
  return [`Hi ${site.name}! I'd like to book: ${title}`, "", ...lines].join("\n");
}
