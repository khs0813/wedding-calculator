import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal/LegalPageShell";
import { getLegalPage } from "@/data/legalPages";
import { absolutePageUrl, absoluteUrl } from "@/lib/seo";

const page = getLegalPage("privacy");

export const metadata: Metadata = {
  title: page?.title,
  description: page?.description,
  keywords: ["개인정보 처리방침", "웨딩 예산 계산기 개인정보", "브라우저 저장", "개인정보 보호"],
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: page?.title,
    description: page?.description,
    url: absolutePageUrl("/privacy"),
    siteName: "웨딩 예산 계산기",
    locale: "ko_KR",
    type: "website",
    images: [{ url: absoluteUrl("/og-default.png"), width: 1200, height: 630, alt: "개인정보 처리방침" }],
  },
  twitter: {
    card: "summary_large_image",
    title: page?.title,
    description: page?.description,
    images: [absoluteUrl("/og-default.png")],
  },
};

export default function PrivacyPage() {
  if (!page) return null;

  return <LegalPageShell page={page} />;
}
