import type { Metadata } from "next";
import { ContentPageShell } from "@/components/content/ContentPageShell";
import { getSitePage } from "@/data/sitePages";
import { absolutePageUrl, absoluteUrl } from "@/lib/seo";

const page = getSitePage("methodology");

export const metadata: Metadata = {
  title: page?.title,
  description: page?.description,
  keywords: ["계산 기준", "웨딩 예산 계산 방법", "계산 로직", "운영 방법"],
  alternates: { canonical: "/methodology" },
  openGraph: {
    title: page?.title,
    description: page?.description,
    url: absolutePageUrl("/methodology"),
    siteName: "웨딩 예산 계산기",
    locale: "ko_KR",
    type: "website",
    images: [{ url: absoluteUrl("/og-default.png"), width: 1200, height: 630, alt: page?.title || "계산 기준과 운영 방법" }],
  },
  twitter: {
    card: "summary_large_image",
    title: page?.title,
    description: page?.description,
    images: [absoluteUrl("/og-default.png")],
  },
};

export default function MethodologyPage() {
  if (!page) return null;
  return <ContentPageShell page={page} />;
}
