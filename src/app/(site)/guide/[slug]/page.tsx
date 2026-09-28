import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articles, getArticle } from "@/data/articles";
import { Photo } from "@/components/Photo";
import { ArrowLeft, ArrowRight } from "@/components/icons";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/guide/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  return a ? { title: a.title, description: a.excerpt } : {};
}

export default async function ArticlePage({ params }: PageProps<"/guide/[slug]">) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  return (
    <article className="px-4 py-10 sm:px-6 lg:py-14">
      <div className="mx-auto flex max-w-3xl flex-col gap-8">
        <Link href="/guide" className="flex items-center gap-2 self-start text-sm font-bold text-sea">
          <ArrowLeft size={18} /> Bali guide
        </Link>
        <header className="flex flex-col gap-3">
          <span className="text-xs font-bold tracking-[0.1em] text-sea uppercase">{article.category} · {article.readMinutes} min read</span>
          <h1 className="font-display text-4xl leading-[1.1] font-semibold tracking-[-0.015em] sm:text-5xl">{article.title}</h1>
          <p className="text-lg leading-relaxed text-muted">{article.excerpt}</p>
        </header>
        <div className="relative h-64 overflow-hidden rounded-[24px] sm:h-96">
          <Photo src={article.image} alt="" fill preload sizes="(min-width: 768px) 768px, 100vw" position={article.imagePosition} />
        </div>
        <div className="flex flex-col gap-6 text-[17px] leading-[1.75] text-body">
          {article.body.map((b, i) => (
            <section key={i} className="flex flex-col gap-2">
              {b.heading && <h2 className="font-display text-2xl font-semibold text-ink">{b.heading}</h2>}
              <p>{b.text}</p>
            </section>
          ))}
        </div>
        <Link href={article.cta.href} className="flex h-13 items-center justify-center gap-2 self-start rounded-xl bg-sun px-6 font-bold text-ink">
          {article.cta.label} <ArrowRight size={18} />
        </Link>
      </div>
    </article>
  );
}
