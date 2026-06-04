import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { guides, getGuideBySlug } from "@/data/guides";
import { absolutePageUrl, absoluteUrl, buildBreadcrumbSchema, createGuideFaqs, createGuideMetadata } from "@/lib/seo";
import type { GuideSlug } from "@/types/calculator";
import { calculators } from "@/data/calculators";
import { Card } from "@/components/ui/card";
import { JsonLd } from "@/components/seo/JsonLd";
import { SectionBlocks } from "@/components/content/SectionBlocks";
import { AuthorBox } from "@/components/content/AuthorBox";
import { FAQSection } from "@/components/seo/FAQSection";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return {};
  return createGuideMetadata(guide.slug as GuideSlug);
}

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  const faqs = createGuideFaqs(guide);

  return (
    <article className="mx-auto max-w-[90rem] px-4 py-10">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: guide.title,
            description: guide.description,
            url: absolutePageUrl(guide.path),
            mainEntityOfPage: absolutePageUrl(guide.path),
            inLanguage: "ko-KR",
            image: absoluteUrl("/og-default.png"),
            datePublished: guide.publishedAt,
            dateModified: guide.updatedAt,
            author: { "@type": "Person", name: guide.author.name },
            publisher: {
              "@type": "Organization",
              name: "웨딩 예산 계산기",
              logo: {
                "@type": "ImageObject",
                url: absoluteUrl("/apple-touch-icon.png"),
              },
            },
          },
          buildBreadcrumbSchema([
            { name: "홈", path: "/" },
            { name: "가이드", path: "/guides" },
            { name: guide.title, path: guide.path },
          ]),
        ]}
      />
      <div className="rounded-4xl border border-blush-100 bg-white/85 p-6 shadow-soft md:p-10">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-blush-700">Guide</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 md:text-5xl">{guide.title}</h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">{guide.description}</p>
        <p className="mt-5 text-sm leading-7 text-slate-600">
          관련 주제: {guide.keywords.join(", ")}
        </p>
        <div className="mt-6 grid gap-3 rounded-3xl border border-blush-100 bg-blush-50/60 p-4 text-sm text-slate-600 md:grid-cols-2">
          <p><span className="font-black text-slate-900">작성</span> {guide.author.name} · {guide.author.role}</p>
          <p><span className="font-black text-slate-900">발행</span> {guide.publishedAt}</p>
          <p><span className="font-black text-slate-900">검토</span> {guide.reviewedBy?.name || "편집팀"}</p>
          <p><span className="font-black text-slate-900">수정</span> {guide.updatedAt}</p>
        </div>
        <div className="mt-5 flex flex-wrap gap-3 text-sm font-black text-blush-800">
          <Link href="/guides" className="underline decoration-blush-200 underline-offset-4">가이드 전체 보기</Link>
          <Link href="/methodology" className="underline decoration-blush-200 underline-offset-4">계산 기준 보기</Link>
        </div>
      </div>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-4xl border border-blush-100 bg-white p-6 shadow-soft md:p-8">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-blush-700">Summary</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">이 가이드 요약</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">{guide.summary || guide.excerpt}</p>
        </div>
        <div className="rounded-4xl border border-blush-100 bg-gradient-to-br from-blush-50 via-cream-50 to-sage-50 p-6 shadow-soft md:p-8">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-blush-700">Next Step</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">바로 이어서 할 일</h2>
          <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-700">
            {guide.sections.slice(0, 3).map((section) => (
              <li key={section.heading}>{section.heading}</li>
            ))}
          </ul>
        </div>
      </section>

      <div className="mt-10 rounded-4xl border border-blush-100 bg-white p-6 shadow-soft md:p-10">
        <SectionBlocks sections={guide.sections} />
      </div>

      <section className="mt-10">
        <AuthorBox author={guide.author} reviewer={guide.reviewedBy} updatedAt={guide.updatedAt} />
      </section>

      <section className="mt-10">
        <FAQSection title={`${guide.title} FAQ`} items={faqs} />
      </section>

      <section className="mt-10 rounded-4xl border border-blush-100 bg-white p-6 shadow-soft md:p-10">
        <h2 className="text-2xl font-black text-slate-950">참고한 자료</h2>
        <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-600">
          {guide.sources.map((source) => (
            <li key={source.href}>
              <a href={source.href} target="_blank" rel="noopener noreferrer" className="underline decoration-blush-200 underline-offset-4 hover:text-blush-800">
                {source.label}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-black text-slate-950">바로 계산해보기</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {calculators.slice(0, 3).map((calculator) => (
            <Card key={calculator.slug} className="p-5">
              <h3 className="font-black text-slate-950">{calculator.shortTitle}</h3>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{calculator.description}</p>
              <Link href={calculator.path} className="mt-4 inline-flex items-center gap-2 text-sm font-black text-blush-800">
                계산하기
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Card>
          ))}
        </div>
      </section>
    </article>
  );
}
