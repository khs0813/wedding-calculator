import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal/LegalPageShell";
import { getLegalPage } from "@/data/legalPages";
import { absoluteUrl } from "@/lib/seo";

const page = getLegalPage("disclaimer");

export const metadata: Metadata = {
  title: page?.title,
  description: page?.description,
  keywords: ["면책고지", "웨딩 예산 계산기 면책", "계산 결과 참고", "예산 계산 유의사항"],
  alternates: { canonical: "/disclaimer" },
  openGraph: {
    title: page?.title,
    description: page?.description,
    url: absoluteUrl("/disclaimer"),
    siteName: "웨딩 예산 계산기",
    locale: "ko_KR",
    type: "website",
    images: [{ url: absoluteUrl("/og-default.png"), width: 1200, height: 630, alt: "면책고지" }],
  },
  twitter: {
    card: "summary_large_image",
    title: page?.title,
    description: page?.description,
    images: [absoluteUrl("/og-default.png")],
  },
};

export default function DisclaimerPage() {
  if (!page) return null;

  return <LegalPageShell page={page} />;
}
