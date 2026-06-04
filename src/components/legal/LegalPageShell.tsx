import type { LegalPage } from "@/data/legalPages";
import { JsonLd } from "@/components/seo/JsonLd";
import { absolutePageUrl, buildBreadcrumbSchema } from "@/lib/seo";
import { FAQSection } from "@/components/seo/FAQSection";
import Link from "next/link";

export function LegalPageShell({ page }: { page: LegalPage }) {
  return (
    <article className="mx-auto max-w-4xl px-4 py-10">
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
        <p className="text-sm font-black uppercase tracking-[0.25em] text-blush-700">Policy</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 md:text-5xl">{page.title}</h1>
        <p className="mt-5 text-base leading-8 text-slate-600">{page.description}</p>
        <p className="mt-4 text-xs font-bold text-slate-500">시행일 및 최종 업데이트: {page.updatedAt}</p>
      </header>

      <section className="mt-8 grid gap-6 md:grid-cols-[1fr_0.9fr]">
        <div className="rounded-4xl border border-blush-100 bg-white p-6 shadow-soft md:p-8">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-blush-700">Summary</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">핵심 안내</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">{page.summary}</p>
        </div>
        <div className="rounded-4xl border border-blush-100 bg-gradient-to-br from-blush-50 via-cream-50 to-sage-50 p-6 shadow-soft md:p-8">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-blush-700">Related</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">함께 확인할 페이지</h2>
          <div className="mt-5 flex flex-wrap gap-3 text-sm font-black text-blush-800">
            <Link href="/about">사이트 소개</Link>
            <Link href="/editorial-policy">편집 기준</Link>
            <Link href="/contact">문의사항</Link>
          </div>
        </div>
      </section>

      <div className="mt-8 space-y-5 rounded-4xl border border-blush-100 bg-white p-6 shadow-soft md:p-10">
        {page.sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-xl font-black text-slate-950">{section.title}</h2>
            <div className="mt-3 space-y-3 text-sm leading-7 text-slate-600">
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="mt-10">
        <FAQSection title={`${page.title} FAQ`} items={page.faqs} />
      </section>
    </article>
  );
}
