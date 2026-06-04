import type { Metadata } from "next";
import { getSafeSiteUrl } from "@/lib/security";
import { calculators } from "@/data/calculators";
import { guides } from "@/data/guides";
import type { CalculatorSlug, FAQItem, Guide, GuideSlug, RichSection } from "@/types/calculator";

const defaultOpenGraphImage = "/og-default.png";

export function getSiteUrl(): string {
  return getSafeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
}

export function absoluteUrl(path: string): string {
  return `${getSiteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

export function toPagePath(path: string): string {
  if (!path || path === "/") {
    return "/";
  }

  const normalized = path.startsWith("/") ? path : `/${path}`;
  return normalized.endsWith("/") ? normalized : `${normalized}/`;
}

export function absolutePageUrl(path: string): string {
  return `${getSiteUrl()}${toPagePath(path)}`;
}

export function buildBreadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absolutePageUrl(item.path),
    })),
  };
}

export function buildFaqSchema(items: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function createGuideFaqs(guide: Guide): FAQItem[] {
  if (guide.faqs?.length) {
    return guide.faqs;
  }

  const sectionPrompts = guide.sections.slice(0, 3).map((section) => ({
    question: `${section.heading}에서 가장 먼저 볼 포인트는 무엇인가요?`,
    answer: section.body[0] || guide.description,
  }));

  return [
    {
      question: `${guide.title} 가이드는 어떤 상황에서 읽으면 좋나요?`,
      answer: guide.summary || guide.excerpt || guide.description,
    },
    ...sectionPrompts,
  ].slice(0, 3);
}

export function createSectionFaqs(sections: RichSection[]): FAQItem[] {
  return sections.slice(0, 3).map((section) => ({
    question: `${section.heading}에서 핵심은 무엇인가요?`,
    answer: section.body[0] || section.bullets?.[0] || "",
  })).filter((item) => item.answer);
}

export function createCalculatorMetadata(slug: CalculatorSlug): Metadata {
  const calculator = calculators.find((item) => item.slug === slug);

  if (!calculator) {
    return {};
  }

  return {
    title: calculator.title,
    description: calculator.description,
    keywords: calculator.keywords,
    alternates: { canonical: calculator.path },
    openGraph: {
      title: calculator.title,
      description: calculator.description,
      url: absolutePageUrl(calculator.path),
      siteName: "웨딩 예산 계산기",
      locale: "ko_KR",
      type: "website",
      images: [
        {
          url: absoluteUrl(defaultOpenGraphImage),
          width: 1200,
          height: 630,
          alt: calculator.title
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: calculator.title,
      description: calculator.description,
      images: [absoluteUrl(defaultOpenGraphImage)]
    },
    robots: {
      index: true,
      follow: true
    }
  };
}

export function createGuideMetadata(slug: GuideSlug): Metadata {
  const guide = guides.find((item) => item.slug === slug);

  if (!guide) {
    return {};
  }

  return {
    title: guide.title,
    description: guide.description,
    keywords: guide.keywords,
    alternates: { canonical: guide.path },
    openGraph: {
      title: guide.title,
      description: guide.description,
      url: absolutePageUrl(guide.path),
      siteName: "웨딩 예산 계산기",
      locale: "ko_KR",
      type: "article",
      images: [
        {
          url: absoluteUrl(defaultOpenGraphImage),
          width: 1200,
          height: 630,
          alt: guide.title
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: guide.title,
      description: guide.description,
      images: [absoluteUrl(defaultOpenGraphImage)]
    },
    robots: {
      index: true,
      follow: true
    }
  };
}
