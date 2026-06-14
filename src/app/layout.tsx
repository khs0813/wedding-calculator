import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { absolutePageUrl, absoluteUrl, getSiteUrl } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
const adsenseApproved = process.env.NEXT_PUBLIC_ADSENSE_APPROVED === "true";
const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  applicationName: "웨딩 예산 계산기",
  creator: "Wedding Budget Calculator",
  publisher: "Wedding Budget Calculator",
  category: "finance",
  title: {
    default: "웨딩 예산 계산기 - 결혼·신혼 준비 비용 계산",
    template: "%s | 웨딩 예산 계산기",
  },
  description: "결혼 비용, 신혼집 예산, 웨딩홀, 스드메, 혼수, 예물, 신혼여행, 축의금을 DB 없이 브라우저에서 계산하고 가이드까지 함께 제공하는 무료 예산 계산기입니다.",
  keywords: ["결혼 비용 계산기", "신혼집 예산 계산기", "웨딩홀 비용", "스드메 가격", "혼수 비용", "축의금 계산기", "결혼 예산 가이드"],
  openGraph: {
    title: "웨딩 예산 계산기",
    description: "결혼 준비와 신혼집 예산을 계산하고 판단 기준까지 함께 읽으세요.",
    url: absolutePageUrl("/"),
    siteName: "웨딩 예산 계산기",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: absoluteUrl("/og-default.png"),
        width: 1200,
        height: 630,
        alt: "웨딩 예산 계산기",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "웨딩 예산 계산기",
    description: "결혼·신혼 준비 비용을 쉽고 안전하게 계산하세요.",
    images: [absoluteUrl("/og-default.png")],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: googleSiteVerification
    ? {
        google: googleSiteVerification,
      }
    : undefined,
  alternates: {
    canonical: "/",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fff1f2",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        {adsenseApproved && adsenseClientId ? (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
            crossOrigin="anonymous"
          />
        ) : null}
      </head>
      <body>
        <JsonLd
          data={[
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "웨딩 예산 계산기",
              url: absolutePageUrl("/"),
              inLanguage: "ko-KR",
              description: "결혼 준비와 신혼집 준비 비용을 계산하고 예산 판단 기준을 읽을 수 있는 무료 도구",
            },
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "웨딩 예산 계산기",
              url: getSiteUrl(),
              logo: absoluteUrl("/apple-touch-icon.png"),
              contactPoint: [
                {
                  "@type": "ContactPoint",
                  contactType: "customer support",
                  email: "moneyfinancecalculator@gmail.com",
                  availableLanguage: ["ko-KR"],
                },
              ],
              sameAs: [],
            },
          ]}
        />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
