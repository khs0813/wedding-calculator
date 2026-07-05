import type { MetadataRoute } from "next";
import { calculators } from "@/data/calculators";
import { calculatorContent } from "@/data/calculatorContent";
import { guides } from "@/data/guides";
import { legalPages } from "@/data/legalPages";
import { sitePages } from "@/data/sitePages";
import { absolutePageUrl } from "@/lib/seo";

export const dynamic = "force-static";

const homeUpdatedAt = "2026-07-04";
const calculatorsIndexUpdatedAt = "2026-07-04";
const guidesIndexUpdatedAt = "2026-07-04";

function toLastMod(value: string): string {
  const koreanDateMatch = value.match(/^(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일$/);
  if (koreanDateMatch) {
    const [, year, month, day] = koreanDateMatch;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  return value.slice(0, 10);
}

function toIsoLastMod(value: string): string {
  return `${toLastMod(value)}T03:00:00.000Z`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: absolutePageUrl("/"),
      lastModified: toIsoLastMod(homeUpdatedAt),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: absolutePageUrl("/calculators"),
      lastModified: toIsoLastMod(calculatorsIndexUpdatedAt),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absolutePageUrl("/guides"),
      lastModified: toIsoLastMod(guidesIndexUpdatedAt),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...calculators.map((calculator) => ({
      url: absolutePageUrl(calculator.path),
      lastModified: toIsoLastMod(calculatorContent[calculator.slug].updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...guides.map((guide) => ({
      url: absolutePageUrl(guide.path),
      lastModified: toIsoLastMod(guide.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...sitePages.map((page) => ({
      url: absolutePageUrl(page.path),
      lastModified: toIsoLastMod(page.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...legalPages.map((page) => ({
      url: absolutePageUrl(page.path),
      lastModified: toIsoLastMod(page.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
