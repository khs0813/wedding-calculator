import { guides } from "@/data/guides";
import { absolutePageUrl, absoluteUrl } from "@/lib/seo";

export const dynamic = "force-static";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toRssDate(value: string): string {
  return new Date(`${value}T00:00:00.000Z`).toUTCString();
}

export function GET() {
  const items = [...guides]
    .sort((a, b) => new Date(`${b.updatedAt}T00:00:00.000Z`).getTime() - new Date(`${a.updatedAt}T00:00:00.000Z`).getTime())
    .map((guide) => {
      const url = absolutePageUrl(guide.path);

      return `
    <item>
      <title>${escapeXml(guide.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <description>${escapeXml(guide.description)}</description>
      <pubDate>${toRssDate(guide.updatedAt)}</pubDate>
    </item>`;
    })
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>웨딩 예산 계산기 가이드</title>
    <link>${escapeXml(absolutePageUrl("/guides"))}</link>
    <atom:link href="${escapeXml(absoluteUrl("/rss.xml"))}" rel="self" type="application/rss+xml" />
    <description>결혼 비용, 신혼집 예산, 웨딩홀, 스드메, 혼수, 신혼여행, 축의금 판단 기준을 정리한 최신 가이드입니다.</description>
    <language>ko-KR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
