import { JsonLd } from "@/components/seo/JsonLd";
import { absolutePageUrl, buildBreadcrumbSchema } from "@/lib/seo";
import type { SiteContentPage } from "@/types/calculator";
import { SectionBlocks } from "@/components/content/SectionBlocks";
import { FAQSection } from "@/components/seo/FAQSection";
import Link from "next/link";

export function ContentPageShell({ page }: { page: SiteContentPage }) {
  return (
    <article className="mx-auto max-w-[90rem] px-4 py-10">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: page.title,
            description: page.description,
            url: absolutePageUrl(page.path),
            inLanguage: "ko-KR",
            dateModified: page.updatedAt,
          },
          buildBreadcrumbSchema([
            { name: "홈", path: "/" },
            { name: page.title, path: page.path },
          ]),
        ]}
      />
      <header className="rounded-4xl border border-blush-100 bg-white/85 p-6 shadow-soft md:p-10">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-blush-700">{page.label}</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 md:text-5xl">{page.title}</h1>
        <p className="mt-5 text-base leading-8 text-slate-600">{page.description}</p>
        <p className="mt-4 text-xs font-bold text-slate-500">최종 업데이트: {page.updatedAt}</p>
      </header>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-4xl border border-blush-100 bg-white p-6 shadow-soft md:p-8">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-blush-700">Summary</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">핵심 요약</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">{page.summary}</p>
        </div>
        <div className="rounded-4xl border border-blush-100 bg-gradient-to-br from-blush-50 via-cream-50 to-sage-50 p-6 shadow-soft md:p-8">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-blush-700">Related</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">함께 보면 좋은 페이지</h2>
          <div className="mt-5 flex flex-wrap gap-3 text-sm font-black text-blush-800">
            <Link href="/guides">예산 가이드 모음</Link>
            <Link href="/methodology">계산 기준과 운영 방법</Link>
            <Link href="/contact">문의사항</Link>
          </div>
        </div>
      </section>

      <div className="mt-8 rounded-4xl border border-blush-100 bg-white p-6 shadow-soft md:p-10">
        <SectionBlocks sections={page.sections} />
      </div>

      <section className="mt-10">
        <FAQSection title={`${page.title} FAQ`} items={page.faqs} />
      </section>
    </article>
  );
}
