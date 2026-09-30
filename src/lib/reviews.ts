export const reviewSources = ["google", "tripadvisor", "instagram", "whatsapp", "direct"] as const;
export type ReviewSource = (typeof reviewSources)[number];

export const reviewSourceLabel: Record<ReviewSource, string> = {
  google: "Google",
  tripadvisor: "Tripadvisor",
  instagram: "Instagram",
  whatsapp: "WhatsApp",
  direct: "Direct",
};

export function sourceLabel(v: string) {
  return (reviewSources as readonly string[]).includes(v) ? reviewSourceLabel[v as ReviewSource] : v;
}

export type Review = { id: string; name: string; country: string | null; rating: number; quote: string; source: string; service: string | null };
export type ReviewSummary = { rating: number; count: number | null; url: string | null };
