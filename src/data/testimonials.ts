// Ulasan tamu ASLI (copy dari Google / TripAdvisor, dengan izin). Selama kosong, blok ulasan disembunyikan.
// Contoh isi:
// { quote: "The scooter was delivered to our villa in 20 minutes...", name: "Sophie M.", country: "Australia", source: "Google" },
export type Testimonial = { quote: string; name: string; country: string; source: "Google" | "TripAdvisor" };

export const testimonials: Testimonial[] = [];
