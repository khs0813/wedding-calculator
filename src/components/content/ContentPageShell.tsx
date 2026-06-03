import { JsonLd } from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo";
import type { SiteContentPage } from "@/types/calculator";
import { SectionBlocks } from "@/components/content/SectionBlocks";

export function ContentPageShell({ page }: { page: SiteContentPage }) {
  return (
    <article className="mx-auto max-w-[90rem] px-4 py-10">
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
        <p className="text-sm font-black uppercase tracking-[0.25em] text-blush-700">{page.label}</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 md:text-5xl">{page.title}</h1>
        <p className="mt-5 text-base leading-8 text-slate-600">{page.description}</p>
        <p className="mt-4 text-xs font-bold text-slate-500">최종 업데이트: {page.updatedAt}</p>
      </header>

      <div className="mt-8 rounded-4xl border border-blush-100 bg-white p-6 shadow-soft md:p-10">
        <SectionBlocks sections={page.sections} />
      </div>
    </article>
  );
}
