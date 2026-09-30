// Data brand & kontak. Ganti semua nilai TODO sebelum website live.
export const site = {
  // TODO: nama brand masih sementara
  name: "Jelajah Bali",
  shortName: "jelajah",
  tagline: "Explore Bali your way.",
  // Alamat website (dipakai sitemap & preview link). Ganti lewat env NEXT_PUBLIC_SITE_URL kalau udah pakai domain sendiri.
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://bali-travel-rental.vercel.app").replace(/\/+$/, ""),
  // Nomor WhatsApp bisnis, format internasional tanpa "+" atau spasi
  whatsapp: "6281239627764",
  whatsappDisplay: "+62 812-3962-7764",
  // TODO: email & alamat asli
  email: "hello@example.com",
  address: "Jl. Contoh No. 1, Canggu, Bali",
  instagram: "jelajahbali",
  freeDeliveryAreas: ["Canggu", "Seminyak", "Kuta", "Ubud"],
  paymentMethods: ["QRIS", "Visa", "Mastercard", "PayPal", "Bank transfer"],
} as const;

