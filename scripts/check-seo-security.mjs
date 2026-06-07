import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://wedding-calculator.onrender.com").replace(/\/$/, "");
const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID?.trim();
const adsensePublisherId = process.env.ADSENSE_PUBLISHER_ID?.trim();
const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();
const routes = [
  { route: "/", inSitemap: true },
  { route: "/guides", inSitemap: true },
  { route: "/summary", inSitemap: false },
  { route: "/about", inSitemap: true },
  { route: "/editorial-policy", inSitemap: true },
  { route: "/methodology", inSitemap: true },
  { route: "/calculators/wedding-cost", inSitemap: true },
  { route: "/calculators/newlywed-home-budget", inSitemap: true },
  { route: "/calculators/wedding-hall-cost", inSitemap: true },
  { route: "/calculators/studio-dress-makeup-cost", inSitemap: true },
  { route: "/calculators/honsu-budget", inSitemap: true },
  { route: "/calculators/wedding-gift-budget", inSitemap: true },
  { route: "/calculators/honeymoon-budget", inSitemap: true },
  { route: "/calculators/congratulatory-money", inSitemap: true },
  { route: "/guides/wedding-cost-guide", inSitemap: true },
  { route: "/guides/newlywed-budget-guide", inSitemap: true },
  { route: "/guides/wedding-saving-tips", inSitemap: true },
  { route: "/guides/wedding-hall-checklist", inSitemap: true },
  { route: "/guides/sdme-options-guide", inSitemap: true },
  { route: "/guides/wedding-gift-negotiation-guide", inSitemap: true },
  { route: "/guides/honsu-priority-guide", inSitemap: true },
  { route: "/guides/honeymoon-destination-budget-guide", inSitemap: true },
  { route: "/guides/congratulatory-money-etiquette-guide", inSitemap: true },
  { route: "/guides/wedding-budget-timeline-guide", inSitemap: true },
  { route: "/guides/small-wedding-budget-guide", inSitemap: true },
  { route: "/guides/newlywed-loan-planning-guide", inSitemap: true },
  { route: "/guides/wedding-contract-check-guide", inSitemap: true },
  { route: "/guides/wedding-guest-budget-table-guide", inSitemap: true },
  { route: "/guides/wedding-hall-meal-cost-table-guide", inSitemap: true },
  { route: "/guides/sdme-extra-cost-table-guide", inSitemap: true },
  { route: "/guides/newlywed-home-initial-cost-guide", inSitemap: true },
  { route: "/guides/appliance-budget-table-guide", inSitemap: true },
  { route: "/guides/honeymoon-budget-ratio-guide", inSitemap: true },
  { route: "/guides/congratulatory-money-table-guide", inSitemap: true },
  { route: "/privacy", inSitemap: true },
  { route: "/terms", inSitemap: true },
  { route: "/disclaimer", inSitemap: true },
  { route: "/contact", inSitemap: true },
];

const errors = [];

function expectedUrl(route) {
  return route === "/" ? `${baseUrl}/` : `${baseUrl}${route}/`;
}

function exportFileForRoute(route) {
  return route === "/" ? "out/index.html" : join("out", route, "index.html");
}

for (const { route } of routes) {
  const file = exportFileForRoute(route);
  if (!existsSync(file)) {
    errors.push(`${route}: build output not found. Run npm run build first.`);
    continue;
  }

  const html = readFileSync(file, "utf8");
  const expected = expectedUrl(route);

  if (!/<title>[^<]{10,}<\/title>/.test(html)) errors.push(`${route}: title missing or too short`);
  if (!/<meta name="description" content="[^"]{50,}"/.test(html)) errors.push(`${route}: description missing or too short`);
  if (!/<meta name="keywords" content="[^"]{5,}"/.test(html)) errors.push(`${route}: keywords missing`);
  if (!html.includes(`<link rel="canonical" href="${expected}"`)) errors.push(`${route}: canonical mismatch`);
  for (const property of ["og:title", "og:description", "og:url", "og:image"]) {
    if (!html.includes(`property="${property}"`)) errors.push(`${route}: ${property} missing`);
  }
  for (const name of ["twitter:card", "twitter:title", "twitter:description", "twitter:image"]) {
    if (!html.includes(`name="${name}"`)) errors.push(`${route}: ${name} missing`);
  }
  if (!html.includes('type="application/ld+json"')) errors.push(`${route}: JSON-LD missing`);
  if (!/<h1[\s>]/.test(html)) errors.push(`${route}: h1 missing`);
}

const homeHtml = existsSync("out/index.html") ? readFileSync("out/index.html", "utf8") : "";
if (adsenseClientId && !homeHtml.includes(`pagead/js/adsbygoogle.js?client=${adsenseClientId}`)) {
  errors.push("AdSense script missing from exported HTML");
}
if (googleSiteVerification && !homeHtml.includes(`name="google-site-verification" content="${googleSiteVerification}"`)) {
  errors.push("google-site-verification meta tag missing");
}

const adsTxtPath = "out/ads.txt";
if (!existsSync(adsTxtPath)) {
  errors.push("ads.txt missing from export");
} else if (adsensePublisherId) {
  const adsTxt = readFileSync(adsTxtPath, "utf8");
  const expectedAdsTxt = `google.com, ${adsensePublisherId}, DIRECT, f08c47fec0942fa0`;
  if (!adsTxt.includes(expectedAdsTxt)) errors.push("ads.txt does not contain the configured AdSense publisher ID");
}

const sitemapPath = "out/sitemap.xml";
const robotsPath = "out/robots.txt";
const sitemapRoutes = routes.filter((item) => item.inSitemap);

if (!existsSync(sitemapPath)) {
  errors.push("sitemap.xml build output missing");
} else {
  const sitemap = readFileSync(sitemapPath, "utf8");
  const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
  if (urls.length !== sitemapRoutes.length) errors.push(`sitemap URL count ${urls.length} !== ${sitemapRoutes.length}`);
  for (const { route } of sitemapRoutes) {
    const expected = expectedUrl(route);
    if (!urls.includes(expected)) errors.push(`sitemap missing ${expected}`);
  }
}

if (!existsSync(robotsPath)) {
  errors.push("robots.txt build output missing");
} else {
  const robots = readFileSync(robotsPath, "utf8");
  if (!robots.includes("User-Agent: *") || !robots.includes("Allow: /")) errors.push("robots allow rule missing");
  if (!robots.includes(`Sitemap: ${baseUrl}/sitemap.xml`)) errors.push("robots sitemap missing");
}

const serverFile = readFileSync("server.mjs", "utf8");
for (const requiredHeader of [
  "Content-Security-Policy",
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

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`SEO/security checks passed for ${routes.length} public routes.`);
