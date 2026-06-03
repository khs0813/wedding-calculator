import type { Metadata } from "next";
import { getSafeSiteUrl } from "@/lib/security";
import { calculators } from "@/data/calculators";
import { guides } from "@/data/guides";
import type { CalculatorSlug, GuideSlug } from "@/types/calculator";

const defaultOpenGraphImage = "/og-default.png";

export function getSiteUrl(): string {
  return getSafeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
}

export function absoluteUrl(path: string): string {
  return `${getSiteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
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
      url: absoluteUrl(calculator.path),
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
      url: absoluteUrl(guide.path),
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
