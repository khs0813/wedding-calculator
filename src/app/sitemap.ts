import type { MetadataRoute } from "next";
import { calculators } from "@/data/calculators";
import { guides } from "@/data/guides";
import { legalPages } from "@/data/legalPages";
import { sitePages } from "@/data/sitePages";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/guides"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    ...calculators.map((calculator) => ({
      url: absoluteUrl(calculator.path),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...guides.map((guide) => ({
      url: absoluteUrl(guide.path),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...sitePages.map((page) => ({
      url: absoluteUrl(page.path),
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    ...legalPages.map((page) => ({
      url: absoluteUrl(page.path),
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.4,
    })),
  ];
}
