import type { LegalPage } from "@/data/legalPages";
import { JsonLd } from "@/components/seo/JsonLd";
import { absolutePageUrl, buildBreadcrumbSchema } from "@/lib/seo";
import { FAQSection } from "@/components/seo/FAQSection";
import Link from "next/link";

export function LegalPageShell({ page }: { page: LegalPage }) {
  return (
    <article className="mx-auto max-w-6xl px-4 py-10">
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
      <header className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-muted-foreground">정책</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-5xl">{page.title}</h1>
        <p className="mt-5 text-base leading-8 text-muted-foreground">{page.description}</p>
        <p className="mt-4 text-xs font-bold text-muted-foreground">시행일 및 최종 업데이트: {page.updatedAt}</p>
      </header>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">요약</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">핵심 안내</h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">{page.summary}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">관련 페이지</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">함께 확인할 페이지</h2>
          <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold text-foreground">
            <Link href="/about/">사이트 소개</Link>
            <Link href="/editorial-policy/">편집 기준</Link>
            <Link href="/contact/">문의사항</Link>
          </div>
        </div>
      </section>

      <div className="mt-8 space-y-5 rounded-2xl border border-border bg-card p-6 shadow-sm md:p-10">
        {page.sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-xl font-semibold text-foreground">{section.title}</h2>
            <div className="mt-3 space-y-3 text-sm leading-7 text-muted-foreground">
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
