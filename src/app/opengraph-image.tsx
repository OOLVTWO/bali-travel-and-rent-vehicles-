import { ogCard, ogContentType, ogSize } from "@/lib/og";
import { site } from "@/data/site";

export const alt = `${site.name}: scooter & car rental, private drivers and tours in Bali`;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogCard({
    eyebrow: "Bali, your way",
    title: "Scooters, cars with driver & tours in Bali",
    meta: "Delivered to your villa · Book in one WhatsApp chat",
  });
}
