import type { Metadata } from "next";
import Link from "next/link";
import { getLegalPage } from "@/data/legalPages";
import { absolutePageUrl, absoluteUrl, buildBreadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { FAQSection } from "@/components/seo/FAQSection";
import { ContactEmailBox } from "@/components/contact/ContactEmailBox";

const page = getLegalPage("contact");

export const metadata: Metadata = {
  title: page?.title || "제휴문의",
  description: page?.description,
  keywords: ["제휴문의", "광고문의", "웨딩 예산 계산기 제휴", "배너 광고", "연락처"],
  alternates: { canonical: absolutePageUrl("/contact/") },
  openGraph: {
    title: page?.title || "제휴문의",
    description: page?.description,
    url: absolutePageUrl("/contact/"),
    siteName: "웨딩 예산 계산기",
    locale: "ko_KR",
    type: "website",
    images: [{ url: absoluteUrl("/og-default.png"), width: 1200, height: 630, alt: page?.title || "제휴문의" }],
  },
  twitter: {
    card: "summary_large_image",
    title: page?.title || "제휴문의",
    description: page?.description,
    images: [absoluteUrl("/og-default.png")],
  },
};

export default function ContactPage() {
  if (!page) return null;

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

      <nav className="no-print mb-4 text-sm font-semibold text-muted-foreground" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="hover:text-foreground">
              홈
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-foreground" aria-current="page">
            {page.title}
          </li>
        </ol>
      </nav>

      <header className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-muted-foreground">{page.title}</p>
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
            <Link href="/privacy/">개인정보처리방침</Link>
            <Link href="/terms/">이용약관</Link>
          </div>
        </div>
      </section>

      <div className="mt-8 space-y-8 rounded-2xl border border-border bg-card p-6 shadow-sm md:p-10">
        <section>
          <h2 className="text-xl font-semibold text-foreground">배너 광고 및 제휴 문의</h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            웨딩 예산 계산기 서비스 내 광고 배너 노출, 제휴 제안, 기타 서비스 관련 문의는 아래 메일 주소로 보내주시기 바랍니다.
          </p>
          <ContactEmailBox email="webinquiry365@gmail.com" />
        </section>

        <section className="border-t border-border pt-8">
          <h2 className="text-xl font-semibold text-foreground">문의 시 참고 사항</h2>
          <ul className="mt-4 list-disc space-y-2.5 pl-5 text-sm leading-7 text-muted-foreground">
            <li>희망하시는 광고 유형(상단 배너, 하단 배너 등) 및 희망 게재 기간을 함께 기재해 주시면 보다 빠른 안내가 가능합니다.</li>
            <li>보내주신 문의는 확인 후 영업일 기준 1~2일 이내에 답변드립니다.</li>
            <li>DB 없는 정적 사이트이므로 서버 저장형 문의 폼은 제공하지 않으며, 이메일 발송 시 사용자의 메일 서비스 정책이 적용됩니다.</li>
          </ul>
        </section>
      </div>

      <section className="mt-10">
        <FAQSection title={`${page.title} FAQ`} items={page.faqs} />
      </section>
    </article>
  );
}
