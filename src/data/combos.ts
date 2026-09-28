import { img } from "./images";

export type Combo = {
  slug: string;
  name: string;
  subtitle: string;
  image: string;
  tag: string;
  includes: string[];
  /** Harga paket (CONTOH) */
  price: number;
};

// CONTOH HARGA — ganti dengan harga asli.
export const combos: Combo[] = [
  {
    slug: "arrival-pack",
    name: "Arrival Pack",
    subtitle: "3 days · 1–2 travellers",
    image: img.beach,
    tag: "Save 15%",
    includes: ["Airport pick-up from Ngurah Rai", "Scooter for 3 days, delivered", "Local SIM card with data"],
    price: 450000,
  },
  {
    slug: "family-bali-4d3n",
    name: "Family Bali 4D3N",
    subtitle: "4 days · up to 6 people",
    image: img.uluwatu,
    tag: "Save 12%",
    includes: ["Return airport transfer", "2 days car + driver, child seat free", "Uluwatu sunset & Kecak tour"],
    price: 3200000,
  },
  {
    slug: "nomad-monthly",
    name: "Nomad Monthly",
    subtitle: "30 days · for long stays",
    image: img.terraces,
    tag: "Monthly",
    includes: ["Scooter for 30 days + free service", "Free swap if it breaks down", "10% off weekend tours"],
    price: 1800000,
  },
];
