import { ogCard, ogContentType, ogSize } from "@/lib/og";
import { site } from "@/data/site";
import { articles, getArticle } from "@/data/articles";

export const alt = `Bali travel guide by ${site.name}`;
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return ogCard({ eyebrow: "Bali guide", title: "Local tips for riding, driving and day trips" });
  return ogCard({ eyebrow: `Bali guide · ${a.category}`, title: a.title, meta: `${a.readMinutes} min read` });
}
