import type { MetadataRoute } from "next";
import { calculators } from "@/data/calculators";
import { guides } from "@/data/guides";
import { legalPages } from "@/data/legalPages";
import { sitePages } from "@/data/sitePages";
import { absolutePageUrl } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: absolutePageUrl("/"),
    },
    {
      url: absolutePageUrl("/calculators"),
    },
    {
      url: absolutePageUrl("/guides"),
    },
    ...calculators.map((calculator) => ({
      url: absolutePageUrl(calculator.path),
    })),
    ...guides.map((guide) => ({
      url: absolutePageUrl(guide.path),
    })),
    ...sitePages.map((page) => ({
      url: absolutePageUrl(page.path),
    })),
    ...legalPages.map((page) => ({
      url: absolutePageUrl(page.path),
    })),
  ];
}
