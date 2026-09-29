// Data brand & kontak. Ganti semua nilai TODO sebelum website live.
export const site = {
  // TODO: nama brand masih sementara
  name: "Jelajah Bali",
  shortName: "jelajah",
  tagline: "Explore Bali your way.",
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

// TODO: isi setelah punya ulasan asli di Google. Selama masih null, baris rating di hero disembunyikan.
export const reviews: { rating: number | null; count: string | null; url: string | null } = {
  rating: null,
  count: null,
  url: null,
};
