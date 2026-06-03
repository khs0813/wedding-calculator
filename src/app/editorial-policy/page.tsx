import type { Metadata } from "next";
import { ContentPageShell } from "@/components/content/ContentPageShell";
import { getSitePage } from "@/data/sitePages";
import { absoluteUrl } from "@/lib/seo";

const page = getSitePage("editorial-policy");

export const metadata: Metadata = {
  title: page?.title,
  description: page?.description,
  keywords: ["편집 기준", "콘텐츠 정책", "웨딩 예산 계산기 운영 기준", "콘텐츠 검수"],
  alternates: { canonical: "/editorial-policy" },
  openGraph: {
    title: page?.title,
    description: page?.description,
    url: absoluteUrl("/editorial-policy"),
    siteName: "웨딩 예산 계산기",
    locale: "ko_KR",
    type: "website",
    images: [{ url: absoluteUrl("/og-default.png"), width: 1200, height: 630, alt: page?.title || "콘텐츠 편집 기준" }],
  },
  twitter: {
    card: "summary_large_image",
    title: page?.title,
    description: page?.description,
    images: [absoluteUrl("/og-default.png")],
  },
};

export default function EditorialPolicyPage() {
  if (!page) return null;
  return <ContentPageShell page={page} />;
}
