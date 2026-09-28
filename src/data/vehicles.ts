import { img } from "./images";

export type VehicleCategory = "scooter" | "car";

export type Vehicle = {
  slug: string;
  name: string;
  category: VehicleCategory;
  subtitle: string;
  seats: number;
  transmission: "Automatic" | "Manual";
  image: string;
  /** Warna latar kartu di belakang foto kendaraan */
  tint: string;
  badge?: string;
  /** Harga sewa lepas kunci per hari (null = tidak tersedia lepas kunci) */
  pricePerDay: number | null;
  /** Harga dengan driver, 10 jam (null = tidak tersedia) */
  priceWithDriver: number | null;
  highlights: string[];
  included: string[];
};

// CONTOH HARGA — ganti dengan harga asli sebelum website live.
export const vehicles: Vehicle[] = [
  {
    slug: "honda-scoopy",
    name: "Honda Scoopy",
    category: "scooter",
    subtitle: "Scooter · 110cc · Automatic",
    seats: 2,
    transmission: "Automatic",
    image: img.scooterCream,
    tint: "bg-sun-soft",
    badge: "Most popular",
    pricePerDay: 90000,
    priceWithDriver: null,
    highlights: ["2 riders", "2 helmets"],
    included: ["2 helmets", "2 rain ponchos", "Phone holder", "Basic insurance", "Free delivery in Canggu, Seminyak, Kuta & Ubud"],
  },
  {
    slug: "yamaha-nmax",
    name: "Yamaha NMAX",
    category: "scooter",
    subtitle: "Maxi scooter · 155cc · Automatic",
    seats: 2,
    transmission: "Automatic",
    image: img.scooterNavy,
    tint: "bg-mist",
    pricePerDay: 150000,
    priceWithDriver: null,
    highlights: ["2 riders", "Big storage"],
    included: ["2 helmets", "2 rain ponchos", "Phone holder", "Basic insurance", "Free delivery in Canggu, Seminyak, Kuta & Ubud"],
  },
  {
    slug: "toyota-avanza",
    name: "Toyota Avanza",
    category: "car",
    subtitle: "MPV · 7 seats · Automatic",
    seats: 7,
    transmission: "Automatic",
    image: img.carSilver,
    tint: "bg-sky-soft",
    pricePerDay: 350000,
    priceWithDriver: 650000,
    highlights: ["7 seats", "Driver optional"],
    included: ["Full tank on delivery", "Basic insurance", "Child seat on request", "24/7 roadside help"],
  },
  {
    slug: "toyota-innova-zenix",
    name: "Toyota Innova Zenix",
    category: "car",
    subtitle: "Premium MPV · 7 seats · with driver",
    seats: 6,
    transmission: "Automatic",
    image: img.carDark,
    tint: "bg-leaf-soft",
    badge: "With driver",
    pricePerDay: null,
    priceWithDriver: 850000,
    highlights: ["6 guests", "English-speaking driver"],
    included: ["English-speaking driver", "Fuel for 10 hours", "Mineral water", "Parking fees", "Child seat on request"],
  },
];

export function getVehicle(slug: string) {
  return vehicles.find((v) => v.slug === slug);
}
