import type { Metadata } from "next";
import { ContentPageShell } from "@/components/content/ContentPageShell";
import { getSitePage } from "@/data/sitePages";
import { absolutePageUrl, absoluteUrl } from "@/lib/seo";

const page = getSitePage("about");

export const metadata: Metadata = {
  title: page?.title,
  description: page?.description,
  keywords: ["웨딩 예산 계산기 소개", "사이트 소개", "결혼 예산 사이트", "운영 소개"],
  alternates: { canonical: "/about" },
  openGraph: {
    title: page?.title,
    description: page?.description,
    url: absolutePageUrl("/about"),
    siteName: "웨딩 예산 계산기",
    locale: "ko_KR",
    type: "website",
    images: [{ url: absoluteUrl("/og-default.png"), width: 1200, height: 630, alt: page?.title || "웨딩 예산 계산기 소개" }],
  },
  twitter: {
    card: "summary_large_image",
    title: page?.title,
    description: page?.description,
    images: [absoluteUrl("/og-default.png")],
  },
};

export default function AboutPage() {
  if (!page) return null;
  return <ContentPageShell page={page} />;
}
