import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal/LegalPageShell";
import { getLegalPage } from "@/data/legalPages";
import { absolutePageUrl, absoluteUrl } from "@/lib/seo";

const page = getLegalPage("terms");

export const metadata: Metadata = {
  title: page?.title,
  description: page?.description,
  keywords: ["이용약관", "웨딩 예산 계산기 약관", "서비스 이용 조건", "예산 계산기 이용"],
  alternates: { canonical: "/terms" },
  openGraph: {
    title: page?.title,
    description: page?.description,
    url: absolutePageUrl("/terms"),
    siteName: "웨딩 예산 계산기",
    locale: "ko_KR",
    type: "website",
    images: [{ url: absoluteUrl("/og-default.png"), width: 1200, height: 630, alt: "이용약관" }],
  },
  twitter: {
    card: "summary_large_image",
    title: page?.title,
    description: page?.description,
    images: [absoluteUrl("/og-default.png")],
  },
};

export default function TermsPage() {
  if (!page) return null;

  return <LegalPageShell page={page} />;
}
