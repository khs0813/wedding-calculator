import type { MetadataRoute } from "next";
import { calculators } from "@/data/calculators";
import { calculatorContent } from "@/data/calculatorContent";
import { guides } from "@/data/guides";
import { legalPages } from "@/data/legalPages";
import { sitePages } from "@/data/sitePages";
import { absolutePageUrl } from "@/lib/seo";

export const dynamic = "force-static";

const homeUpdatedAt = "2026-06-03";
const calculatorsIndexUpdatedAt = "2026-06-03";
const guidesIndexUpdatedAt = "2026-06-03";

function toLastMod(value: string): string {
  const koreanDateMatch = value.match(/^(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일$/);
  if (koreanDateMatch) {
    const [, year, month, day] = koreanDateMatch;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  return value.slice(0, 10);
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: absolutePageUrl("/"),
      lastModified: toLastMod(homeUpdatedAt),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absolutePageUrl("/calculators"),
      lastModified: toLastMod(calculatorsIndexUpdatedAt),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absolutePageUrl("/guides"),
      lastModified: toLastMod(guidesIndexUpdatedAt),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    ...calculators.map((calculator) => ({
      url: absolutePageUrl(calculator.path),
      lastModified: toLastMod(calculatorContent[calculator.slug].updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...guides.map((guide) => ({
      url: absolutePageUrl(guide.path),
      lastModified: toLastMod(guide.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...sitePages.map((page) => ({
      url: absolutePageUrl(page.path),
      lastModified: toLastMod(page.updatedAt),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    ...legalPages.map((page) => ({
      url: absolutePageUrl(page.path),
      lastModified: toLastMod(page.updatedAt),
      changeFrequency: "yearly" as const,
      priority: 0.4,
    })),
  ];
}
