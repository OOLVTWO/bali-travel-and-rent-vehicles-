import { img } from "./images";

export type Article = {
  slug: string;
  title: string;
  category: string;
  readMinutes: number;
  image: string;
  imagePosition?: string;
  excerpt: string;
  body: { heading?: string; text: string }[];
  cta: { label: string; href: string };
};

export const articles: Article[] = [
  {
    slug: "ubud-by-scooter",
    title: "One perfect day in Ubud by scooter: route, stops and parking",
    category: "Routes",
    readMinutes: 6,
    image: img.terraces,
    excerpt: "A relaxed loop north of Ubud that fits in one day, with easy parking at every stop.",
    body: [
      { text: "Ubud is best explored early. Leave before 8 am and you will have the rice terraces almost to yourself." },
      { heading: "The loop", text: "Start at Tegallalang rice terraces, ride 20 minutes north to Tirta Empul water temple, then head back south for lunch in central Ubud. Finish with a sunset walk on the Campuhan Ridge." },
      { heading: "Parking", text: "Every stop has scooter parking for a small fee, usually Rp 2,000–5,000. Keep small notes ready and always take the key with you." },
      { heading: "Before you ride", text: "Wear your helmet, carry your driving licence and keep the rain poncho under the seat. Afternoon showers are common from November to March." },
    ],
    cta: { label: "Rent a scooter for this route", href: "/rentals?type=scooter" },
  },
  {
    slug: "driving-licence-bali",
    title: "Do you need an international driving permit to ride in Bali?",
    category: "Good to know",
    readMinutes: 4,
    image: img.temple,
    excerpt: "Short answer: yes. Here is what to carry and what happens at a police check.",
    body: [
      { text: "To ride a scooter or drive a car in Bali you need a valid licence from your home country plus an International Driving Permit (IDP) for the right vehicle class. For scooters, the IDP must cover motorcycles." },
      { heading: "What to carry", text: "Your home licence, your IDP and a copy of your passport. Helmets are compulsory for rider and passenger." },
      { heading: "Police checks", text: "Checks are common on main roads in Canggu, Kuta and Ubud. Riding without the right licence can mean a fine, and most travel insurance will not cover accidents without one." },
      { heading: "No permit?", text: "Book a car with a driver instead. It costs less than most people expect and you can relax between stops." },
    ],
    cta: { label: "Book a car with driver", href: "/rentals?mode=driver" },
  },
  {
    slug: "nusa-penida-west-vs-east",
    title: "Nusa Penida west vs east: which day trip should you pick?",
    category: "Islands",
    readMinutes: 7,
    image: img.cliff,
    imagePosition: "70% 50%",
    excerpt: "Both sides are stunning. Pick west for the famous views, east for fewer crowds.",
    body: [
      { heading: "West coast", text: "Kelingking Beach, Broken Beach, Angel's Billabong and Crystal Bay. These are the views you have seen online. Expect more people, especially at Kelingking around midday." },
      { heading: "East coast", text: "Diamond Beach, Atuh Beach and the Thousand Islands viewpoint. The roads are longer, but the beaches feel quieter and you can swim at Atuh." },
      { heading: "Our tip", text: "First visit? Go west. Been before or want a beach day? Go east. Either way, a private car on the island saves a lot of time." },
    ],
    cta: { label: "See Nusa Penida tours", href: "/tours/nusa-penida-west" },
  },
];

export function getArticle(slug: string) {
  return articles.find((a) => a.slug === slug);
}
