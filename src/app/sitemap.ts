import type { MetadataRoute } from "next";
import { calculators } from "@/data/calculators";
import { calculatorContent } from "@/data/calculatorContent";
import { guides } from "@/data/guides";
import { legalPages } from "@/data/legalPages";
import { sitePages } from "@/data/sitePages";
import { absolutePageUrl } from "@/lib/seo";

export const dynamic = "force-static";

const homeUpdatedAt = "2026-06-03";
const guidesIndexUpdatedAt = "2026-06-03";

function toDate(value: string): Date {
  const koreanDateMatch = value.match(/^(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일$/);
  if (koreanDateMatch) {
    const [, year, month, day] = koreanDateMatch;
    return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  }

  return new Date(`${value}T00:00:00.000Z`);
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: absolutePageUrl("/"),
      lastModified: toDate(homeUpdatedAt),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absolutePageUrl("/guides"),
      lastModified: toDate(guidesIndexUpdatedAt),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    ...calculators.map((calculator) => ({
      url: absolutePageUrl(calculator.path),
      lastModified: toDate(calculatorContent[calculator.slug].updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...guides.map((guide) => ({
      url: absolutePageUrl(guide.path),
      lastModified: toDate(guide.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...sitePages.map((page) => ({
      url: absolutePageUrl(page.path),
      lastModified: toDate(page.updatedAt),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    ...legalPages.map((page) => ({
      url: absolutePageUrl(page.path),
      lastModified: toDate(page.updatedAt),
      changeFrequency: "yearly" as const,
      priority: 0.4,
    })),
  ];
}
