import { readFileSync, existsSync } from "node:fs";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://wedding-budget-calculator.onrender.com";
const routes = [
  { route: "/", file: ".next/server/app/index.html", inSitemap: true },
  { route: "/guides", file: ".next/server/app/guides.html", inSitemap: true },
  { route: "/summary", file: ".next/server/app/summary.html", inSitemap: false },
  { route: "/about", file: ".next/server/app/about.html", inSitemap: true },
  { route: "/editorial-policy", file: ".next/server/app/editorial-policy.html", inSitemap: true },
  { route: "/methodology", file: ".next/server/app/methodology.html", inSitemap: true },
  { route: "/calculators/wedding-cost", file: ".next/server/app/calculators/wedding-cost.html", inSitemap: true },
  { route: "/calculators/newlywed-home-budget", file: ".next/server/app/calculators/newlywed-home-budget.html", inSitemap: true },
  { route: "/calculators/wedding-hall-cost", file: ".next/server/app/calculators/wedding-hall-cost.html", inSitemap: true },
  { route: "/calculators/studio-dress-makeup-cost", file: ".next/server/app/calculators/studio-dress-makeup-cost.html", inSitemap: true },
  { route: "/calculators/honsu-budget", file: ".next/server/app/calculators/honsu-budget.html", inSitemap: true },
  { route: "/calculators/wedding-gift-budget", file: ".next/server/app/calculators/wedding-gift-budget.html", inSitemap: true },
  { route: "/calculators/honeymoon-budget", file: ".next/server/app/calculators/honeymoon-budget.html", inSitemap: true },
  { route: "/calculators/congratulatory-money", file: ".next/server/app/calculators/congratulatory-money.html", inSitemap: true },
  { route: "/guides/wedding-cost-guide", file: ".next/server/app/guides/wedding-cost-guide.html", inSitemap: true },
  { route: "/guides/newlywed-budget-guide", file: ".next/server/app/guides/newlywed-budget-guide.html", inSitemap: true },
  { route: "/guides/wedding-saving-tips", file: ".next/server/app/guides/wedding-saving-tips.html", inSitemap: true },
  { route: "/guides/wedding-hall-checklist", file: ".next/server/app/guides/wedding-hall-checklist.html", inSitemap: true },
  { route: "/guides/sdme-options-guide", file: ".next/server/app/guides/sdme-options-guide.html", inSitemap: true },
  { route: "/guides/wedding-gift-negotiation-guide", file: ".next/server/app/guides/wedding-gift-negotiation-guide.html", inSitemap: true },
  { route: "/guides/honsu-priority-guide", file: ".next/server/app/guides/honsu-priority-guide.html", inSitemap: true },
  { route: "/guides/honeymoon-destination-budget-guide", file: ".next/server/app/guides/honeymoon-destination-budget-guide.html", inSitemap: true },
  { route: "/guides/congratulatory-money-etiquette-guide", file: ".next/server/app/guides/congratulatory-money-etiquette-guide.html", inSitemap: true },
  { route: "/guides/wedding-budget-timeline-guide", file: ".next/server/app/guides/wedding-budget-timeline-guide.html", inSitemap: true },
  { route: "/guides/small-wedding-budget-guide", file: ".next/server/app/guides/small-wedding-budget-guide.html", inSitemap: true },
  { route: "/guides/newlywed-loan-planning-guide", file: ".next/server/app/guides/newlywed-loan-planning-guide.html", inSitemap: true },
  { route: "/guides/wedding-contract-check-guide", file: ".next/server/app/guides/wedding-contract-check-guide.html", inSitemap: true },
  { route: "/privacy", file: ".next/server/app/privacy.html", inSitemap: true },
  { route: "/terms", file: ".next/server/app/terms.html", inSitemap: true },
  { route: "/disclaimer", file: ".next/server/app/disclaimer.html", inSitemap: true },
  { route: "/contact", file: ".next/server/app/contact.html", inSitemap: true },
];

const errors = [];

function expectedUrl(route) {
  return route === "/" ? baseUrl.replace(/\/$/, "") : `${baseUrl.replace(/\/$/, "")}${route}`;
}

for (const { route, file } of routes) {
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

const sitemapPath = ".next/server/app/sitemap.xml.body";
const robotsPath = ".next/server/app/robots.txt.body";
const sitemapRoutes = routes.filter((item) => item.inSitemap);

if (!existsSync(sitemapPath)) {
  errors.push("sitemap.xml build output missing");
} else {
  const sitemap = readFileSync(sitemapPath, "utf8");
  const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
  if (urls.length !== sitemapRoutes.length) errors.push(`sitemap URL count ${urls.length} !== ${sitemapRoutes.length}`);
  for (const { route } of sitemapRoutes) {
    const expected = route === "/" ? `${baseUrl.replace(/\/$/, "")}/` : expectedUrl(route);
    if (!urls.includes(expected)) errors.push(`sitemap missing ${expected}`);
  }
}

if (!existsSync(robotsPath)) {
  errors.push("robots.txt build output missing");
} else {
  const robots = readFileSync(robotsPath, "utf8");
  if (!robots.includes("User-Agent: *") || !robots.includes("Allow: /")) errors.push("robots allow rule missing");
  if (!robots.includes(`Sitemap: ${baseUrl.replace(/\/$/, "")}/sitemap.xml`)) errors.push("robots sitemap missing");
}

const nextConfig = readFileSync("next.config.mjs", "utf8");
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
  if (!nextConfig.includes(requiredHeader)) errors.push(`security header missing: ${requiredHeader}`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`SEO/security checks passed for ${routes.length} public routes.`);
