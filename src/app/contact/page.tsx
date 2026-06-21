import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal/LegalPageShell";
import { getLegalPage } from "@/data/legalPages";
import { absolutePageUrl, absoluteUrl } from "@/lib/seo";

const page = getLegalPage("contact");

export const metadata: Metadata = {
  title: page?.title,
  description: page?.description,
  keywords: ["문의사항", "웨딩 예산 계산기 문의", "오류 제보", "개선 제안", "연락처"],
  alternates: { canonical: "/contact" },
  openGraph: {
    title: page?.title,
    description: page?.description,
    url: absolutePageUrl("/contact"),
    siteName: "웨딩 예산 계산기",
    locale: "ko_KR",
    type: "website",
    images: [{ url: absoluteUrl("/og-default.png"), width: 1200, height: 630, alt: "문의사항" }],
  },
  twitter: {
    card: "summary_large_image",
    title: page?.title,
    description: page?.description,
    images: [absoluteUrl("/og-default.png")],
  },
};

export default function ContactPage() {
  if (!page) return null;

  return <LegalPageShell page={page} />;
}
