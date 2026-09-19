import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://weddingbudget.co.kr").replace(/\/$/, "");
const naverSiteVerification = "7f9774b684775497fa37bf8593bbe8c004c44548";
const coupangSdkSrc = "https://ads-partners.coupang.com/g.js";
const routes = [
  { route: "/", inSitemap: true, index: true },
  { route: "/calculators", inSitemap: true, index: true },
  { route: "/guides", inSitemap: true, index: true },
  { route: "/summary", inSitemap: false, index: false },
  { route: "/about", inSitemap: true, index: true },
  { route: "/editorial-policy", inSitemap: true, index: true },
  { route: "/methodology", inSitemap: true, index: true },
  { route: "/calculators/wedding-cost", inSitemap: true, index: true },
  { route: "/calculators/newlywed-home-budget", inSitemap: true, index: true },
  { route: "/calculators/wedding-hall-cost", inSitemap: true, index: true },
  { route: "/calculators/studio-dress-makeup-cost", inSitemap: true, index: true },
  { route: "/calculators/honsu-budget", inSitemap: true, index: true },
  { route: "/calculators/wedding-gift-budget", inSitemap: true, index: true },
  { route: "/calculators/honeymoon-budget", inSitemap: true, index: true },
  { route: "/calculators/congratulatory-money", inSitemap: true, index: true },
  { route: "/guides/wedding-cost-guide", inSitemap: true, index: true },
  { route: "/guides/newlywed-budget-guide", inSitemap: true, index: true },
  { route: "/guides/wedding-saving-tips", inSitemap: true, index: true },
  { route: "/guides/wedding-hall-checklist", inSitemap: true, index: true },
  { route: "/guides/sdme-options-guide", inSitemap: true, index: true },
  { route: "/guides/wedding-gift-negotiation-guide", inSitemap: true, index: true },
  { route: "/guides/honsu-priority-guide", inSitemap: true, index: true },
  { route: "/guides/honeymoon-destination-budget-guide", inSitemap: true, index: true },
  { route: "/guides/congratulatory-money-etiquette-guide", inSitemap: true, index: true },
  { route: "/guides/wedding-budget-timeline-guide", inSitemap: true, index: true },
  { route: "/guides/small-wedding-budget-guide", inSitemap: true, index: true },
  { route: "/guides/newlywed-loan-planning-guide", inSitemap: true, index: true },
  { route: "/guides/wedding-contract-check-guide", inSitemap: true, index: true },
  { route: "/guides/wedding-guest-budget-table-guide", inSitemap: true, index: true },
  { route: "/guides/wedding-hall-meal-cost-table-guide", inSitemap: true, index: true },
  { route: "/guides/sdme-extra-cost-table-guide", inSitemap: true, index: true },
  { route: "/guides/newlywed-home-initial-cost-guide", inSitemap: true, index: true },
  { route: "/guides/appliance-budget-table-guide", inSitemap: true, index: true },
  { route: "/guides/honeymoon-budget-ratio-guide", inSitemap: true, index: true },
  { route: "/guides/congratulatory-money-table-guide", inSitemap: true, index: true },
  { route: "/privacy", inSitemap: true, index: true },
  { route: "/terms", inSitemap: true, index: true },
  { route: "/disclaimer", inSitemap: true, index: true },
  { route: "/contact", inSitemap: true, index: true },
];

const errors = [];
const seoAuditRows = [];
const titleOccurrences = new Map();
const descriptionOccurrences = new Map();
const guideSource = readFileSync("src/data/guides.ts", "utf8");
const guides = [...guideSource.matchAll(/slug:\s*"([^"]+)",[\s\S]*?path:\s*"([^"]+)",[\s\S]*?publishedAt:\s*"(\d{4}-\d{2}-\d{2})",[\s\S]*?updatedAt:\s*"(\d{4}-\d{2}-\d{2})",/g)]
  .map((match) => ({
    slug: match[1],
    path: match[2],
    publishedAt: match[3],
    updatedAt: match[4],
  }));

if (!guides.length) {
  errors.push("guide metadata source could not be parsed");
}

function expectedUrl(route) {
  const pageRoute = route === "/" ? "/" : route.endsWith("/") ? route : `${route}/`;
  return `${baseUrl}${pageRoute}`;
}

function extractTags(html, tagName) {
  return [...html.matchAll(new RegExp(`<${tagName}\\b[^>]*>`, "gi"))].map((match) => match[0]);
}

function attr(tag, name) {
  const match = tag.match(new RegExp(`${name}=["']([^"']+)["']`, "i"));
  return match?.[1] || "";
}

function canonicalLinks(html) {
  return extractTags(html, "link")
    .filter((tag) => attr(tag, "rel").toLowerCase().split(/\s+/).includes("canonical"))
    .map((tag) => attr(tag, "href"));
}

function titleValues(html) {
  return [...html.matchAll(/<title>([\s\S]*?)<\/title>/gi)]
    .map((match) => cleanText(match[1]));
}

function metaNameValues(html, name) {
  return extractTags(html, "meta")
    .filter((tag) => attr(tag, "name").toLowerCase() === name)
    .map((tag) => attr(tag, "content"));
}

function metaPropertyValues(html, property) {
  return extractTags(html, "meta")
    .filter((tag) => attr(tag, "property").toLowerCase() === property)
    .map((tag) => attr(tag, "content"));
}

function cleanText(value) {
  return withoutReactMarkers(String(value || ""))
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function h1Values(html) {
  return [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)]
    .map((match) => cleanText(match[1]));
}

function decodeHtmlEntities(value) {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function getJsonLdAudit(html) {
  const blocks = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  const types = [];
  const parseErrors = [];

  for (const block of blocks) {
    try {
      const parsed = JSON.parse(decodeHtmlEntities(block[1].trim()));
      const entries = Array.isArray(parsed) ? parsed : [parsed];
      for (const entry of entries) {
        if (Array.isArray(entry?.["@type"])) {
          types.push(...entry["@type"]);
        } else if (entry?.["@type"]) {
          types.push(entry["@type"]);
        }
      }
    } catch (error) {
      parseErrors.push(error instanceof Error ? error.message : "JSON-LD parse error");
    }
  }

  return {
    count: blocks.length,
    types: [...new Set(types)].join(", "),
    errors: parseErrors,
  };
}

function addOccurrence(map, value, row) {
  if (!value) return;
  const current = map.get(value) || [];
  current.push(row);
  map.set(value, current);
}

function isStaticOrControlPath(pathname) {
  return (
    pathname === "/" ||
    pathname.startsWith("/_next/") ||
    pathname === "/api" ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/.well-known/") ||
    /\/[^/]+\.[^/]+$/.test(pathname)
  );
}

function internalPageLinks(html) {
  return extractTags(html, "a")
    .map((tag) => attr(tag, "href"))
    .filter((href) => href && !href.startsWith("#") && !href.startsWith("mailto:") && !href.startsWith("tel:"))
    .map((href) => {
      try {
        return new URL(href, baseUrl);
      } catch {
        return null;
      }
    })
    .filter((url) => url && url.origin === baseUrl)
    .filter((url) => !isStaticOrControlPath(url.pathname));
}

function exportFileForRoute(route) {
  return route === "/" ? "out/index.html" : join("out", route, "index.html");
}

function routeForPathname(pathname) {
  return pathname === "/" ? "/" : pathname.replace(/\/$/, "");
}

function withoutReactMarkers(html) {
  return html.replaceAll("<!-- -->", "");
}

const sitemapPath = "out/sitemap.xml";
const robotsPath = "out/robots.txt";
const rssPath = "out/rss.xml";
const sitemapRoutes = routes.filter((item) => item.inSitemap);
let sitemapUrls = [];

if (existsSync(sitemapPath)) {
  const sitemapXml = readFileSync(sitemapPath, "utf8");
  sitemapUrls = [...sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
}

for (const { route, index } of routes) {
  const file = exportFileForRoute(route);
  if (!existsSync(file)) {
    errors.push(`${route}: build output not found. Run npm run build first.`);
    continue;
  }

  const html = readFileSync(file, "utf8");
  const expected = expectedUrl(route);
  const routeErrorStart = errors.length;
  const titles = titleValues(html);
  const descriptions = metaNameValues(html, "description");
  const h1s = h1Values(html);
  const canonical = canonicalLinks(html);
  const ogTitles = metaPropertyValues(html, "og:title");
  const ogDescriptions = metaPropertyValues(html, "og:description");
  const ogImages = metaPropertyValues(html, "og:image");
  const ogUrls = metaPropertyValues(html, "og:url");
  const jsonLd = getJsonLdAudit(html);
  const robotsValues = metaNameValues(html, "robots");
  const routeIsIndexable = index !== false && !robotsValues.some((value) => value.includes("noindex"));
  const sitemapIncluded = sitemapUrls.includes(expected);
  const bodyText = cleanText(html.replace(/<script\b[\s\S]*?<\/script>/gi, "").replace(/<style\b[\s\S]*?<\/style>/gi, ""));

  if (titles.length !== 1) errors.push(`${route}: title count ${titles.length} !== 1`);
  if (!titles[0]) errors.push(`${route}: title missing`);
  if (titles[0]?.length > 40) errors.push(`${route}: title length ${titles[0].length} > 40`);
  if (descriptions.length !== 1) errors.push(`${route}: description count ${descriptions.length} !== 1`);
  if (!descriptions[0]) errors.push(`${route}: description missing`);
  if (descriptions[0]?.length > 80) errors.push(`${route}: description length ${descriptions[0].length} > 80`);
  if (h1s.length !== 1) errors.push(`${route}: h1 count ${h1s.length} !== 1`);
  if (!/<meta name="keywords" content="[^"]{5,}"/.test(html)) errors.push(`${route}: keywords missing`);
  if (canonical.length !== 1) errors.push(`${route}: canonical count ${canonical.length} !== 1`);
  if (canonical[0] !== expected) errors.push(`${route}: canonical ${canonical[0] || "missing"} !== ${expected}`);
  if (ogTitles.length !== 1) errors.push(`${route}: og:title count ${ogTitles.length} !== 1`);
  if (ogDescriptions.length !== 1) errors.push(`${route}: og:description count ${ogDescriptions.length} !== 1`);
  if (ogImages.length !== 1) errors.push(`${route}: og:image count ${ogImages.length} !== 1`);
  if (ogUrls.length !== 1) errors.push(`${route}: og:url count ${ogUrls.length} !== 1`);
  if (ogUrls[0] !== expected) errors.push(`${route}: og:url ${ogUrls[0] || "missing"} !== ${expected}`);
  for (const name of ["twitter:card", "twitter:title", "twitter:description", "twitter:image"]) {
    if (!html.includes(`name="${name}"`)) errors.push(`${route}: ${name} missing`);
  }
  const robotsMatch = html.match(/<meta name="robots" content="([^"]+)"/);
  const robotsContent = robotsMatch?.[1] || "";
  if (index === false && !robotsContent.includes("noindex")) errors.push(`${route}: noindex robots meta missing`);
  if (index === false && !robotsContent.includes("follow")) errors.push(`${route}: follow robots meta missing`);
  if (index !== false && robotsContent.includes("noindex")) errors.push(`${route}: indexable route has noindex robots meta`);
  if (jsonLd.count === 0) errors.push(`${route}: JSON-LD missing`);
  for (const jsonLdError of jsonLd.errors) {
    errors.push(`${route}: JSON-LD parse error: ${jsonLdError}`);
  }
  if (routeIsIndexable && !sitemapIncluded) errors.push(`${route}: indexable route missing from sitemap`);
  if (!routeIsIndexable && sitemapIncluded) errors.push(`${route}: noindex route appears in sitemap`);
  if (bodyText.length < 300) errors.push(`${route}: initial HTML body content too short`);

  for (const link of internalPageLinks(html)) {
    if (!link.pathname.endsWith("/")) {
      errors.push(`${route}: internal link is not canonical: ${link.pathname}${link.search}${link.hash}`);
    }
    if (!existsSync(exportFileForRoute(routeForPathname(link.pathname)))) {
      errors.push(`${route}: internal link target missing: ${link.pathname}`);
    }
  }

  const row = {
    URL: expected,
    "title 길이": titles[0]?.length ?? 0,
    "description 길이": descriptions[0]?.length ?? 0,
    "H1 개수": h1s.length,
    canonical: canonical[0] || "missing",
    "index 여부": routeIsIndexable ? "index" : "noindex",
    "sitemap 포함 여부": sitemapIncluded ? "yes" : "no",
    "OG 이미지": ogImages[0] || "missing",
    "JSON-LD 유형": jsonLd.types || "missing",
    오류: "",
  };
  row.__title = titles[0] || "";
  row.__description = descriptions[0] || "";
  row.__errors = errors.slice(routeErrorStart).filter((message) => message.startsWith(`${route}: `)).map((message) => message.replace(`${route}: `, ""));
  row.오류 = row.__errors.join(" | ") || "없음";
  seoAuditRows.push(row);
  addOccurrence(titleOccurrences, row.__title, row);
  addOccurrence(descriptionOccurrences, row.__description, row);
}

for (const [title, rows] of titleOccurrences.entries()) {
  if (rows.length <= 1) continue;
  const affectedUrls = rows.map((row) => row.URL).join(", ");
  errors.push(`duplicate title "${title}": ${affectedUrls}`);
  for (const row of rows) {
    row.__errors.push("title duplicate");
    row.오류 = row.__errors.join(" | ");
  }
}

for (const [description, rows] of descriptionOccurrences.entries()) {
  if (rows.length <= 1) continue;
  const affectedUrls = rows.map((row) => row.URL).join(", ");
  errors.push(`duplicate description "${description}": ${affectedUrls}`);
  for (const row of rows) {
    row.__errors.push("description duplicate");
    row.오류 = row.__errors.join(" | ");
  }
}

for (const guide of guides) {
  const file = exportFileForRoute(guide.path);
  if (!existsSync(file)) {
    errors.push(`${guide.path}: guide build output not found. Run npm run build first.`);
    continue;
  }

  const html = readFileSync(file, "utf8");
  const visibleHtml = withoutReactMarkers(html);
  if (!html.includes(`property="article:published_time" content="${guide.publishedAt}"`)) {
    errors.push(`${guide.path}: article:published_time mismatch`);
  }
  if (!html.includes(`property="article:modified_time" content="${guide.updatedAt}"`)) {
    errors.push(`${guide.path}: article:modified_time mismatch`);
  }
  if (!html.includes(`"datePublished":"${guide.publishedAt}"`)) {
    errors.push(`${guide.path}: JSON-LD datePublished mismatch`);
  }
  if (!html.includes(`"dateModified":"${guide.updatedAt}"`)) {
    errors.push(`${guide.path}: JSON-LD dateModified mismatch`);
  }
  if (!visibleHtml.includes(`발행</span> ${guide.publishedAt}`)) {
    errors.push(`${guide.path}: visible published date mismatch`);
  }
  if (!visibleHtml.includes(`수정</span> ${guide.updatedAt}`)) {
    errors.push(`${guide.path}: visible modified date mismatch`);
  }
}

const homeHtml = existsSync("out/index.html") ? readFileSync("out/index.html", "utf8") : "";
if (!homeHtml.includes(`name="naver-site-verification" content="${naverSiteVerification}"`)) {
  errors.push("naver-site-verification meta tag missing");
}

const adsTxtPath = "out/ads.txt";
if (!existsSync(adsTxtPath)) {
  errors.push("ads.txt missing from export");
} else {
  const adsTxt = readFileSync(adsTxtPath, "utf8");
  if (/google\.com,\s*pub-/.test(adsTxt)) errors.push("ads.txt still contains an AdSense publisher entry");
}

const sourceText = readProjectText(["src", "scripts", "public", "README.md", "SECURITY_SEO_AUDIT.md", ".env.example", "render.yaml"]);
for (const legacySnippet of ["adsby" + "google", "google" + "syndication", "Google " + "AdSense", "t1." + "daumcdn.net", "t1." + "kakaocdn.net/kas"]) {
  if (sourceText.includes(legacySnippet)) errors.push(`legacy ad snippet still present: ${legacySnippet}`);
}
if (!sourceText.includes(coupangSdkSrc)) errors.push("Coupang Partners SDK source missing");

if (!existsSync(sitemapPath)) {
  errors.push("sitemap.xml build output missing");
} else {
  const sitemap = readFileSync(sitemapPath, "utf8");
  const lastmods = [...sitemap.matchAll(/<lastmod>(.*?)<\/lastmod>/g)].map((match) => match[1]);
  const uniqueUrls = new Set(sitemapUrls);
  if (!sitemap.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')) {
    errors.push("sitemap.xml urlset namespace missing");
  }
  if (sitemap.includes("<changefreq>")) errors.push("sitemap.xml should not include changefreq");
  if (sitemap.includes("<priority>")) errors.push("sitemap.xml should not include priority");
  if (sitemapUrls.length !== sitemapRoutes.length) errors.push(`sitemap URL count ${sitemapUrls.length} !== ${sitemapRoutes.length}`);
  if (sitemapUrls.length !== uniqueUrls.size) errors.push(`sitemap URL list has duplicates: count ${sitemapUrls.length}, unique ${uniqueUrls.size}`);
  if (lastmods.length !== sitemapUrls.length) errors.push(`sitemap lastmod count ${lastmods.length} !== URL count ${sitemapUrls.length}`);
  for (const lastmod of lastmods) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(lastmod)) errors.push(`sitemap invalid lastmod format: ${lastmod}`);
  }
  for (const url of sitemapUrls) {
    const parsedUrl = new URL(url);
    if (!url.startsWith(`${baseUrl}/`)) errors.push(`sitemap URL is not under canonical domain: ${url}`);
    if (url.includes("://www.")) errors.push(`sitemap URL includes www domain: ${url}`);
    if (parsedUrl.search || parsedUrl.hash) errors.push(`sitemap URL contains query or hash: ${url}`);
    if (parsedUrl.pathname !== "/" && !parsedUrl.pathname.endsWith("/")) errors.push(`sitemap URL is not canonical trailing slash page: ${url}`);
    if (!existsSync(exportFileForRoute(routeForPathname(parsedUrl.pathname)))) {
      errors.push(`sitemap URL has no exported 200 page: ${url}`);
    }
  }
  for (const { route } of sitemapRoutes) {
    const expected = expectedUrl(route);
    if (!sitemapUrls.includes(expected)) errors.push(`sitemap missing ${expected}`);
  }
  for (const { route } of routes.filter((item) => !item.inSitemap)) {
    const expected = expectedUrl(route);
    if (sitemapUrls.includes(expected)) errors.push(`sitemap includes non-index route ${expected}`);
  }
  for (const guide of guides) {
    const expected = expectedUrl(guide.path);
    const entryMatch = sitemap.match(new RegExp(`<loc>${expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}<\\/loc>\\s*<lastmod>(.*?)<\\/lastmod>`));
    if (!entryMatch) {
      errors.push(`sitemap missing guide lastmod entry ${expected}`);
    } else if (entryMatch[1] !== guide.updatedAt) {
      errors.push(`${guide.path}: sitemap lastmod ${entryMatch[1]} !== updatedAt ${guide.updatedAt}`);
    }
  }
}

if (!existsSync(robotsPath)) {
  errors.push("robots.txt build output missing");
} else {
  const robots = readFileSync(robotsPath, "utf8");
  if (!robots.includes("User-agent: *") || !robots.includes("Allow: /")) errors.push("robots allow rule missing");
  if (!robots.includes(`Sitemap: ${baseUrl}/sitemap.xml`)) errors.push("robots sitemap missing");
}

if (!existsSync(rssPath)) {
  errors.push("rss.xml build output missing");
} else {
  const rss = readFileSync(rssPath, "utf8");
  if (!rss.includes("<rss version=\"2.0\"")) errors.push("rss.xml root missing");
  if (!rss.includes("<channel>")) errors.push("rss.xml channel missing");
  if (!rss.includes(`${baseUrl}/guides/`)) errors.push("rss.xml guide link missing");
  if (rss.includes(`${baseUrl}/summary/`)) errors.push("rss.xml includes noindex summary route");
  if (!homeHtml.includes('rel="alternate"') || !homeHtml.includes("application/rss+xml")) {
    errors.push("RSS alternate link missing from home HTML");
  }
}

const serverFile = readFileSync("server.mjs", "utf8");
if (!serverFile.includes("canonicalRedirectLocation") || !serverFile.includes("canonicalPathname") || !serverFile.includes("X-Robots-Tag")) {
  errors.push("server.mjs trailing slash 301 redirect missing");
}
for (const requiredHeader of [
  "Content-Security-Policy-Report-Only",
  "Referrer-Policy",
  "X-Content-Type-Options",
  "X-Frame-Options",
  "Strict-Transport-Security",
  "Permissions-Policy",
  "Cross-Origin-Opener-Policy",
  "Cross-Origin-Resource-Policy",
  "Origin-Agent-Cluster",
]) {
  if (!serverFile.includes(requiredHeader)) errors.push(`security header missing: ${requiredHeader}`);
}

const securityTxtPath = "out/.well-known/security.txt";
if (!existsSync(securityTxtPath)) {
  errors.push("security.txt build output missing");
} else {
  const securityTxt = readFileSync(securityTxtPath, "utf8");
  for (const field of ["Contact:", "Preferred-Languages:", "Canonical:", "Expires:"]) {
    if (!securityTxt.includes(field)) errors.push(`security.txt field missing: ${field}`);
  }
}

const renderYamlPath = "render.yaml";
if (!existsSync(renderYamlPath)) {
  errors.push("render.yaml missing");
} else {
  const renderYaml = readFileSync(renderYamlPath, "utf8");
  for (const requiredSnippet of [
    "runtime: node",
    "buildCommand: npm ci && npm run build -- --webpack",
    "startCommand: npm run start",
    "NEXT_PUBLIC_SITE_URL",
    "https://weddingbudget.co.kr",
    "renderSubdomainPolicy: disabled",
  ]) {
    if (!renderYaml.includes(requiredSnippet)) {
      errors.push(`render.yaml Node deployment config missing: ${requiredSnippet}`);
    }
  }
}

function readProjectText(paths) {
  const chunks = [];

  for (const path of paths) {
    if (!existsSync(path)) continue;
    const stat = statSync(path);
    if (stat.isDirectory()) {
      for (const file of walkTextFiles(path)) {
        chunks.push(readFileSync(file, "utf8"));
      }
    } else {
      chunks.push(readFileSync(path, "utf8"));
    }
  }

  return chunks.join("\n");
}

function walkTextFiles(directory) {
  const files = [];

  for (const entry of readdirSync(directory)) {
    const fullPath = join(directory, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      if (entry === ".next" || entry === "node_modules" || entry === ".git") continue;
      files.push(...walkTextFiles(fullPath));
    } else if (/\.(ts|tsx|mjs|js|json|md|txt|yaml|yml)$/.test(entry)) {
      files.push(fullPath);
    }
  }

  return files;
}

console.table(seoAuditRows.map((row) => ({
  URL: row.URL,
  "title 길이": row["title 길이"],
  "description 길이": row["description 길이"],
  "H1 개수": row["H1 개수"],
  canonical: row.canonical,
  "index 여부": row["index 여부"],
  "sitemap 포함 여부": row["sitemap 포함 여부"],
  "OG 이미지": row["OG 이미지"],
  "JSON-LD 유형": row["JSON-LD 유형"],
  오류: row.오류,
})));

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`SEO/security checks passed for ${routes.length} public routes.`);
