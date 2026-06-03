import type { LegalPage } from "@/data/legalPages";
import { JsonLd } from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo";

export function LegalPageShell({ page }: { page: LegalPage }) {
  return (
    <article className="mx-auto max-w-4xl px-4 py-10">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: page.title,
          description: page.description,
          url: absoluteUrl(page.path),
          inLanguage: "ko-KR",
          dateModified: page.updatedAt,
        }}
      />
      <header className="rounded-4xl border border-blush-100 bg-white/85 p-6 shadow-soft md:p-10">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-blush-700">Policy</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 md:text-5xl">{page.title}</h1>
        <p className="mt-5 text-base leading-8 text-slate-600">{page.description}</p>
        <p className="mt-4 text-xs font-bold text-slate-500">시행일 및 최종 업데이트: {page.updatedAt}</p>
      </header>

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
    </article>
  );
}
