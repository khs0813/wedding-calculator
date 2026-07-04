import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { absolutePageUrl, absoluteUrl, getSiteUrl } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
const adsenseApproved = process.env.NEXT_PUBLIC_ADSENSE_APPROVED === "true";
const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
const naverSiteVerification = process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION || "7f9774b684775497fa37bf8593bbe8c004c44548";
const siteDescription = "결혼 비용, 신혼집, 웨딩홀, 스드메, 혼수, 예물, 신혼여행 예산을 계산하는 무료 예산표입니다.";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  applicationName: "웨딩 예산 계산기",
  creator: "웨딩 예산 계산기",
  publisher: "웨딩 예산 계산기",
  category: "finance",
  title: {
    default: "웨딩 예산 계산기 - 결혼·신혼 준비 비용 계산",
    template: "%s | 웨딩 예산 계산기",
  },
  description: siteDescription,
  keywords: ["결혼 비용 계산기", "신혼집 예산 계산기", "웨딩홀 비용", "스드메 가격", "혼수 비용", "축의금 계산기", "결혼 예산 가이드"],
  openGraph: {
    title: "웨딩 예산 계산기",
    description: siteDescription,
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
    description: siteDescription,
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
    types: {
      "application/rss+xml": absoluteUrl("/rss.xml"),
    },
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
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="alternate" type="application/rss+xml" title="웨딩 예산 계산기 가이드 RSS" href={absoluteUrl("/rss.xml")} />
        {adsenseApproved && adsenseClientId ? (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
            crossOrigin="anonymous"
          />
        ) : null}
        {naverSiteVerification ? <meta name="naver-site-verification" content={naverSiteVerification} /> : null}
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
