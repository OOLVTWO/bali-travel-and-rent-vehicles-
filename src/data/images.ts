// Semua gambar masih ilustrasi placeholder.
// Ganti file-nya dengan foto asli (lihat halaman "Prompt Aset Foto" untuk nama file & ukuran),
// lalu ubah path di sini, misalnya hero: "/images/hero/hero-tegallalang.jpg".
const p = (name: string) => `/images/placeholder/${name}.svg`;

export const img = {
  hero: p("hero"),
  terraces: p("terraces"),
  cliff: p("cliff"),
  batur: p("batur"),
  temple: p("temple"),
  uluwatu: p("uluwatu"),
  beach: p("beach"),
  scooterCream: p("scooter-cream"),
  scooterNavy: p("scooter-navy"),
  carSilver: p("car-silver"),
  carDark: p("car-dark"),
} as const;
