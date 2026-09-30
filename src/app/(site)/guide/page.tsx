import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { articles } from "@/data/articles";
import { ArticleCard } from "@/components/cards";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = pageMeta({
  title: "Bali guide",
  description: "Local tips for riding, driving and day trips in Bali.",
  path: "/guide",
});

export default function GuidePage() {
  return (
    <>
      <PageHeader eyebrow="Bali guide" title="Plan smarter with local tips." text="Routes, rules of the road and honest advice on which day trip to pick." />
      <section className="px-4 py-12 sm:px-6 lg:px-16 lg:py-16">
        <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {articles.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      </section>
    </>
  );
}
