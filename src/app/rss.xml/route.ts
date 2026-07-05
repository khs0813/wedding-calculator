import { calculatorContent } from "@/data/calculatorContent";
import { calculators } from "@/data/calculators";
import { guides } from "@/data/guides";
import { legalPages } from "@/data/legalPages";
import { sitePages } from "@/data/sitePages";
import { absolutePageUrl, absoluteUrl } from "@/lib/seo";

export const dynamic = "force-static";

type FeedItem = {
  title: string;
  path: string;
  description: string;
  updatedAt: string;
};

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function escapeCdata(value: string): string {
  return value.replaceAll("]]>", "]]]]><![CDATA[>");
}

function toDateOnly(value: string): string {
  const koreanDateMatch = value.match(/^(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일$/);
  if (koreanDateMatch) {
    const [, year, month, day] = koreanDateMatch;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  return value.slice(0, 10);
}

function toRssDate(value: string): string {
  const date = toDateOnly(value);
  const [year, month, day] = date.split("-").map(Number);
  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][new Date(Date.UTC(year, month - 1, day)).getUTCDay()];
  const monthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][month - 1];

  return `${weekday}, ${day} ${monthName} ${year} 12:00:00 +0900`;
}

function buildContent(title: string, description: string): string {
  return `<article><h1>${escapeXml(title)}</h1><p>${escapeXml(description)}</p></article>`;
}

export function GET() {
  const feedItems: FeedItem[] = [
    {
      title: "웨딩 예산 계산기 | 결혼·신혼 준비 비용 계산기",
      path: "/",
      description: "결혼 준비 비용, 신혼집 예산, 웨딩홀, 스드메, 혼수, 신혼여행, 축의금을 한 곳에서 계산하고 정리하세요.",
      updatedAt: "2026-07-04",
    },
    {
      title: "결혼·신혼 예산 계산기 모음",
      path: "/calculators",
      description: "결혼 비용, 신혼집 예산, 웨딩홀, 스드메, 혼수, 신혼여행, 축의금 계산기를 한곳에서 확인하세요.",
      updatedAt: "2026-07-04",
    },
    {
      title: "결혼 준비 예산 가이드 모음",
      path: "/guides",
      description: "결혼 준비 비용과 신혼 예산을 현실적으로 정리하기 위한 가이드와 체크리스트를 확인하세요.",
      updatedAt: "2026-07-04",
    },
    ...calculators.map((calculator) => ({
      title: calculator.title,
      path: calculator.path,
      description: calculator.description,
      updatedAt: calculatorContent[calculator.slug].updatedAt,
    })),
    ...guides.map((guide) => ({
      title: guide.title,
      path: guide.path,
      description: guide.description,
      updatedAt: guide.updatedAt,
    })),
    ...sitePages.map((page) => ({
      title: page.title,
      path: page.path,
      description: page.description,
      updatedAt: page.updatedAt,
    })),
    ...legalPages.map((page) => ({
      title: page.title,
      path: page.path,
      description: page.description,
      updatedAt: page.updatedAt,
    })),
  ];

  const sortedItems = feedItems.sort((a, b) => toDateOnly(b.updatedAt).localeCompare(toDateOnly(a.updatedAt)));
  const lastBuildDate = toRssDate(sortedItems[0]?.updatedAt || "2026-07-04");

  const items = sortedItems
    .map((item) => {
      const url = absolutePageUrl(item.path);
      const content = buildContent(item.title, item.description);

      return `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <description>${escapeXml(item.description)}</description>
      <pubDate>${toRssDate(item.updatedAt)}</pubDate>
      <content:encoded><![CDATA[${escapeCdata(content)}]]></content:encoded>
    </item>`;
    })
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>웨딩 예산 계산기 가이드</title>
    <link>${escapeXml(absolutePageUrl("/"))}</link>
    <atom:link href="${escapeXml(absoluteUrl("/rss.xml"))}" rel="self" type="application/rss+xml" />
    <description>결혼 비용, 신혼집 예산, 웨딩홀, 스드메, 혼수, 신혼여행, 축의금 계산기와 가이드를 정리한 최신 RSS입니다.</description>
    <language>ko-KR</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
