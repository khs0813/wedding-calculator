import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-static";

export function GET() {
  const robots = `User-agent: *
Allow: /

Sitemap: ${absoluteUrl("/sitemap.xml")}
`;

  return new Response(robots, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
