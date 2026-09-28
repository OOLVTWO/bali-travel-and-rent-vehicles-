import { img } from "./images";

export type TourCategory = "sunrise" | "islands" | "temples" | "beaches" | "nature";

export type Tour = {
  slug: string;
  title: string;
  area: string;
  categories: TourCategory[];
  duration: string;
  pickup: string;
  summary: string;
  image: string;
  imagePosition?: string;
  gallery: { src: string; alt: string; position?: string }[];
  facts: string[];
  highlights: { name: string; image: string; position?: string }[];
  itinerary: { time: string; title: string }[];
  included: string[];
  excluded: string[];
  /** Harga mulai per orang (CONTOH) */
  priceFrom: number;
  badge?: string;
  featured?: boolean;
};

export const tourCategories: { id: TourCategory; label: string }[] = [
  { id: "sunrise", label: "Sunrise" },
  { id: "islands", label: "Islands" },
  { id: "temples", label: "Temples" },
  { id: "beaches", label: "Beaches" },
  { id: "nature", label: "Nature" },
];

// CONTOH HARGA & JADWAL — sesuaikan dengan paket asli.
export const tours: Tour[] = [
  {
    slug: "nusa-penida-west",
    title: "Nusa Penida West Island Tour",
    area: "Nusa Penida",
    categories: ["islands", "beaches"],
    duration: "Full day",
    pickup: "Hotel pick-up 06:30",
    summary:
      "Fast boat from Sanur and a private car on the island. See Kelingking Beach, Broken Beach, Angel's Billabong and Crystal Bay in one day.",
    image: img.cliff,
    gallery: [
      { src: img.cliff, alt: "Kelingking Beach viewpoint" },
      { src: img.beach, alt: "Crystal Bay" },
      { src: img.cliff, alt: "Broken Beach", position: "20% 50%" },
      { src: img.uluwatu, alt: "Sunset on the ride back" },
      { src: img.beach, alt: "Fast boat to Nusa Penida", position: "85% 50%" },
    ],
    facts: ["Pick-up 06:30", "Fast boat incl.", "Lunch & tickets", "Free cancel 24 h"],
    highlights: [
      { name: "Kelingking Beach", image: img.cliff, position: "80% 50%" },
      { name: "Crystal Bay", image: img.beach },
      { name: "Broken Beach", image: img.cliff, position: "20% 50%" },
      { name: "Angel's Billabong", image: img.uluwatu },
    ],
    itinerary: [
      { time: "06:30", title: "Pick-up from your hotel or villa" },
      { time: "08:00", title: "Fast boat from Sanur to Nusa Penida" },
      { time: "09:00", title: "Kelingking Beach viewpoint" },
      { time: "11:00", title: "Broken Beach & Angel's Billabong" },
      { time: "13:00", title: "Lunch at a local warung" },
      { time: "14:30", title: "Crystal Bay" },
      { time: "16:30", title: "Fast boat back, drop-off at your hotel" },
    ],
    included: ["Hotel pick-up & drop-off", "Return fast boat", "Private car & driver on the island", "Entrance fees", "Lunch & mineral water"],
    excluded: ["Snorkeling gear", "Tips", "Personal expenses"],
    priceFrom: 950000,
    badge: "Best seller",
    featured: true,
  },
  {
    slug: "mount-batur-sunrise",
    title: "Mount Batur Sunrise Trek",
    area: "Kintamani",
    categories: ["sunrise", "nature"],
    duration: "8 hours",
    pickup: "Hotel pick-up 02:00",
    summary: "An easy-to-moderate night hike to the top of an active volcano, with breakfast and a sea of clouds at sunrise.",
    image: img.batur,
    gallery: [
      { src: img.batur, alt: "Sunrise over Mount Batur" },
      { src: img.terraces, alt: "Coffee plantation stop" },
      { src: img.temple, alt: "Lake Batur in the morning" },
    ],
    facts: ["Pick-up 02:00", "Local guide", "Breakfast at the top", "Free cancel 24 h"],
    highlights: [
      { name: "Summit sunrise", image: img.batur },
      { name: "Lake Batur view", image: img.temple },
      { name: "Coffee plantation", image: img.terraces },
    ],
    itinerary: [
      { time: "02:00", title: "Pick-up from your hotel" },
      { time: "04:00", title: "Start the hike with a local guide" },
      { time: "06:00", title: "Sunrise and breakfast at the summit" },
      { time: "08:00", title: "Hike down, coffee plantation stop" },
      { time: "10:30", title: "Drop-off at your hotel" },
    ],
    included: ["Hotel pick-up & drop-off", "Certified local guide", "Flashlight", "Breakfast & water", "Entrance fee"],
    excluded: ["Hiking shoes", "Tips"],
    priceFrom: 650000,
  },
  {
    slug: "uluwatu-sunset-kecak",
    title: "Uluwatu Sunset & Kecak",
    area: "Uluwatu",
    categories: ["temples", "beaches"],
    duration: "Half day",
    pickup: "Hotel pick-up 14:00",
    summary: "Cliff-top temple at sunset followed by the Kecak fire dance, with a stop at a white sand beach on the way.",
    image: img.uluwatu,
    gallery: [
      { src: img.uluwatu, alt: "Uluwatu temple at sunset" },
      { src: img.beach, alt: "Padang Padang beach" },
    ],
    facts: ["Pick-up 14:00", "Kecak tickets incl.", "Private car", "Free cancel 24 h"],
    highlights: [
      { name: "Uluwatu Temple", image: img.uluwatu },
      { name: "Kecak fire dance", image: img.uluwatu, position: "80% 50%" },
      { name: "Padang Padang Beach", image: img.beach },
    ],
    itinerary: [
      { time: "14:00", title: "Pick-up from your hotel" },
      { time: "15:00", title: "Padang Padang Beach" },
      { time: "17:00", title: "Uluwatu Temple at sunset" },
      { time: "18:00", title: "Kecak fire dance" },
      { time: "20:00", title: "Drop-off, or dinner at Jimbaran on request" },
    ],
    included: ["Private car & driver", "Kecak tickets", "Temple entrance & sarong", "Mineral water"],
    excluded: ["Dinner", "Tips"],
    priceFrom: 450000,
  },
  {
    slug: "bedugul-lake-temple",
    title: "Bedugul Lake Temple & Waterfalls",
    area: "Bedugul",
    categories: ["temples", "nature"],
    duration: "Full day",
    pickup: "Hotel pick-up 08:00",
    summary: "Cool mountain air, Ulun Danu Beratan temple on the lake, twin waterfalls and a local fruit market.",
    image: img.temple,
    gallery: [
      { src: img.temple, alt: "Ulun Danu Beratan temple" },
      { src: img.terraces, alt: "Jatiluwih rice terraces" },
    ],
    facts: ["Pick-up 08:00", "Private car", "Entrance fees incl.", "Free cancel 24 h"],
    highlights: [
      { name: "Ulun Danu Beratan", image: img.temple },
      { name: "Jatiluwih rice terraces", image: img.terraces },
    ],
    itinerary: [
      { time: "08:00", title: "Pick-up from your hotel" },
      { time: "10:00", title: "Jatiluwih rice terraces" },
      { time: "12:30", title: "Lunch with a lake view" },
      { time: "14:00", title: "Ulun Danu Beratan temple" },
      { time: "15:30", title: "Banyumala twin waterfalls" },
      { time: "18:00", title: "Drop-off at your hotel" },
    ],
    included: ["Private car & driver", "Entrance fees", "Mineral water"],
    excluded: ["Lunch", "Tips"],
    priceFrom: 550000,
  },
  {
    slug: "canggu-surf-lesson",
    title: "Canggu Surf Lesson",
    area: "Canggu",
    categories: ["beaches"],
    duration: "2 hours",
    pickup: "Meet at Batu Bolong beach",
    summary: "Beginner-friendly lesson on soft-top boards with a certified instructor. Add a scooter with a surf rack for the rest of your stay.",
    image: img.beach,
    gallery: [{ src: img.beach, alt: "Batu Bolong beach" }],
    facts: ["2 hours", "Board & rash guard", "Certified instructor", "Free cancel 24 h"],
    highlights: [{ name: "Batu Bolong beach", image: img.beach }],
    itinerary: [
      { time: "0:00", title: "Warm-up and safety briefing on the sand" },
      { time: "0:20", title: "Practice in the white water" },
      { time: "1:45", title: "Photos and cool-down" },
    ],
    included: ["Soft-top board", "Rash guard", "Certified instructor", "Mineral water"],
    excluded: ["Transport (add a scooter or car)", "Photos package"],
    priceFrom: 400000,
  },
  {
    slug: "ubud-highlights",
    title: "Ubud Rice Terraces & Monkey Forest",
    area: "Ubud",
    categories: ["nature", "temples"],
    duration: "Full day",
    pickup: "Hotel pick-up 08:30",
    summary: "Tegallalang rice terraces, the Sacred Monkey Forest, a water temple and Ubud art market with a private driver.",
    image: img.terraces,
    gallery: [
      { src: img.terraces, alt: "Tegallalang rice terraces" },
      { src: img.temple, alt: "Water temple" },
    ],
    facts: ["Pick-up 08:30", "Private car", "Entrance fees incl.", "Free cancel 24 h"],
    highlights: [
      { name: "Tegallalang", image: img.terraces },
      { name: "Water temple", image: img.temple },
    ],
    itinerary: [
      { time: "08:30", title: "Pick-up from your hotel" },
      { time: "10:00", title: "Tegallalang rice terraces" },
      { time: "12:00", title: "Lunch in Ubud" },
      { time: "13:30", title: "Sacred Monkey Forest" },
      { time: "15:00", title: "Ubud art market" },
      { time: "17:30", title: "Drop-off at your hotel" },
    ],
    included: ["Private car & driver", "Entrance fees", "Mineral water"],
    excluded: ["Lunch", "Tips"],
    priceFrom: 500000,
  },
];

export function getTour(slug: string) {
  return tours.find((t) => t.slug === slug);
}
