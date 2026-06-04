import type { MetadataRoute } from "next";
import { calculators } from "@/data/calculators";
import { guides } from "@/data/guides";
import { legalPages } from "@/data/legalPages";
import { sitePages } from "@/data/sitePages";
import { absolutePageUrl } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const policyPages = legalPages.filter((page) => page.slug !== "contact");

  return [
    {
      url: absolutePageUrl("/"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absolutePageUrl("/guides"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    ...calculators.map((calculator) => ({
      url: absolutePageUrl(calculator.path),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...guides.map((guide) => ({
      url: absolutePageUrl(guide.path),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...sitePages.map((page) => ({
      url: absolutePageUrl(page.path),
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    ...policyPages.map((page) => ({
      url: absolutePageUrl(page.path),
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.4,
    })),
  ];
}
