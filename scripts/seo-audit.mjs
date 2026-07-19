import { writeFileSync } from "node:fs";

const canonicalOrigin = "https://weddingbudget.co.kr";
const googlebotUserAgent = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";
const defaultUserAgent = "WeddingBudgetSEOAudit/1.0";
const baseUrl = normalizeBaseUrl(process.argv[2] || process.env.SEO_AUDIT_BASE_URL || canonicalOrigin);
const resultPath = process.env.SEO_AUDIT_RESULT_PATH || "seo-audit-result.json";
const maxRedirects = 5;

const checks = [];
const issues = [];

function normalizeBaseUrl(value) {
  const parsed = new URL(value);
  parsed.pathname = parsed.pathname.replace(/\/?$/, "/");
  parsed.search = "";
  parsed.hash = "";
  return parsed;
}

function isLocalBase() {
  return ["localhost", "127.0.0.1", "::1"].includes(baseUrl.hostname);
}

function fetchUrlFor(target) {
  const parsed = new URL(target, canonicalOrigin);
  if (isLocalBase() || baseUrl.origin !== canonicalOrigin) {
    return new URL(`${parsed.pathname}${parsed.search}`, baseUrl).toString();
  }

  return parsed.toString();
}

function displayUrlFor(target) {
  return new URL(target, canonicalOrigin).toString();
}

function pageCanonicalFor(pathname) {
  const pagePath = pathname === "/" ? "/" : pathname.endsWith("/") ? pathname : `${pathname}/`;
  return `${canonicalOrigin}${pagePath}`;
}

function addCheck(name, target, pass, detail = "", status = "") {
  checks.push({
    check: name,
    target,
    status: String(status),
    result: pass ? "PASS" : "FAIL",
    detail,
  });
  if (!pass) {
    issues.push(`${name}: ${target}${detail ? ` - ${detail}` : ""}`);
  }
}

async function tracedFetch(target, { userAgent = defaultUserAgent, readBody = true } = {}) {
  let currentUrl = fetchUrlFor(target);
  const requestedUrl = currentUrl;
  const chain = [];

  for (let index = 0; index <= maxRedirects; index += 1) {
    const response = await fetch(currentUrl, {
      redirect: "manual",
      headers: {
        "User-Agent": userAgent,
        Accept: "text/html,application/xhtml+xml,application/xml,text/plain;q=0.9,*/*;q=0.8",
      },
    });
    const headers = Object.fromEntries(response.headers.entries());
    const location = response.headers.get("location");

    if (response.status >= 300 && response.status < 400 && location) {
      const nextUrl = new URL(location, currentUrl).toString();
      chain.push({
        url: currentUrl,
        status: response.status,
        location: nextUrl,
      });
      currentUrl = nextUrl;
      continue;
    }

    return {
      requestedUrl,
      finalUrl: currentUrl,
      status: response.status,
      headers,
      body: readBody ? await response.text() : "",
      chain,
    };
  }

  throw new Error(`redirect chain exceeded ${maxRedirects}: ${target}`);
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

function metaRobots(html, name = "robots") {
  return extractTags(html, "meta")
    .filter((tag) => attr(tag, "name").toLowerCase() === name)
    .map((tag) => attr(tag, "content"));
}

function hasNoindex(value) {
  return value.toLowerCase().split(/\s*,\s*|\s+/).includes("noindex");
}

function hasFollow(value) {
  const directives = value.toLowerCase().split(/\s*,\s*|\s+/);
  return directives.includes("follow") && !directives.includes("nofollow");
}

function hasHeaderNoindex(headers) {
  return Object.entries(headers)
    .filter(([key]) => key.toLowerCase() === "x-robots-tag")
    .some(([, value]) => hasNoindex(value));
}

function sameSeoResponse(a, b) {
  return (
    a.status === b.status &&
    canonicalLinks(a.body).join("|") === canonicalLinks(b.body).join("|") &&
    metaRobots(a.body).join("|") === metaRobots(b.body).join("|") &&
    metaRobots(a.body, "googlebot").join("|") === metaRobots(b.body, "googlebot").join("|") &&
    (a.headers["x-robots-tag"] || "") === (b.headers["x-robots-tag"] || "")
  );
}

function parseSitemapUrls(xml) {
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1].trim());
}

async function auditIndexablePage(loc) {
  const path = new URL(loc).pathname;
  const normal = await tracedFetch(path);
  const bot = await tracedFetch(path, { userAgent: googlebotUserAgent });
  const canonical = canonicalLinks(normal.body);
  const robots = metaRobots(normal.body);
  const googlebotRobots = metaRobots(normal.body, "googlebot");
  const xRobotsTag = normal.headers["x-robots-tag"] || "";

  addCheck("sitemap URL returns 200", loc, normal.status === 200, `chain=${normal.chain.length}`, normal.status);
  addCheck("sitemap URL has no redirect", loc, normal.chain.length === 0, normal.chain.map((item) => `${item.status}->${item.location}`).join(" | "));
  addCheck("canonical count is one", loc, canonical.length === 1, `count=${canonical.length}`);
  addCheck("canonical is self", loc, canonical[0] === loc, `canonical=${canonical[0] || "missing"}`);
  addCheck("meta robots allows index", loc, !robots.some(hasNoindex), `robots=${robots.join(" | ") || "missing"}`);
  addCheck("googlebot noindex absent", loc, !googlebotRobots.some(hasNoindex), `googlebot=${googlebotRobots.join(" | ") || "missing"}`);
  addCheck("X-Robots-Tag noindex absent", loc, !hasNoindex(xRobotsTag), `x-robots-tag=${xRobotsTag || "missing"}`);
  addCheck("Googlebot SEO response matches default", loc, sameSeoResponse(normal, bot), "status/canonical/robots/x-robots compared");
}

async function auditSummary(sitemapUrls) {
  const loc = `${canonicalOrigin}/summary/`;
  const response = await tracedFetch("/summary/");
  const canonical = canonicalLinks(response.body);
  const robots = metaRobots(response.body);
  const xRobotsTag = response.headers["x-robots-tag"] || "";
  const xRobotsNoindex = xRobotsTag ? hasNoindex(xRobotsTag) : true;

  addCheck("summary returns 200", loc, response.status === 200, "", response.status);
  addCheck("summary excluded from sitemap", loc, !sitemapUrls.includes(loc));
  addCheck("summary canonical is self", loc, canonical.length === 1 && canonical[0] === loc, `canonical=${canonical.join(" | ") || "missing"}`);
  addCheck("summary meta robots noindex follow", loc, robots.some((value) => hasNoindex(value) && hasFollow(value)), `robots=${robots.join(" | ") || "missing"}`);
  addCheck("summary X-Robots-Tag not conflicting", loc, xRobotsNoindex, `x-robots-tag=${xRobotsTag || "not set"}`);
}

async function auditQueryUrls(sitemapUrls) {
  const samples = [
    {
      label: "calculator shared state query",
      path: "/calculators/wedding-cost/?state=seo-audit",
      expectedCanonical: `${canonicalOrigin}/calculators/wedding-cost/`,
      requiresNoindex: true,
    },
    {
      label: "calculator tracking query",
      path: "/calculators/wedding-cost/?utm_source=seo-audit&gclid=test&fbclid=test",
      expectedCanonical: `${canonicalOrigin}/calculators/wedding-cost/`,
      requiresNoindex: true,
    },
    {
      label: "guide search query",
      path: "/guides/?q=budget",
      expectedCanonical: `${canonicalOrigin}/guides/`,
      requiresNoindex: true,
    },
  ];

  for (const sample of samples) {
    const response = await tracedFetch(sample.path);
    const canonical = canonicalLinks(response.body);
    const robots = metaRobots(response.body);
    const xRobotsTag = response.headers["x-robots-tag"] || "";
    const hasNoindexDirective = robots.some(hasNoindex) || hasHeaderNoindex(response.headers);

    addCheck(sample.label, sample.path, response.status === 200, "", response.status);
    addCheck(`${sample.label} canonical strips query`, sample.path, canonical.length === 1 && canonical[0] === sample.expectedCanonical, `canonical=${canonical.join(" | ") || "missing"}`);
    addCheck(`${sample.label} noindex`, sample.path, !sample.requiresNoindex || hasNoindexDirective, `robots=${robots.join(" | ") || "missing"}, x-robots-tag=${xRobotsTag || "missing"}`);
    addCheck(`${sample.label} absent from sitemap`, sample.path, !sitemapUrls.includes(displayUrlFor(sample.path)));
  }

  addCheck("sitemap has no query URLs", "sitemap.xml", sitemapUrls.every((url) => !new URL(url).search));
  addCheck("sitemap has no fragment URLs", "sitemap.xml", sitemapUrls.every((url) => !new URL(url).hash));
}

async function auditRedirects() {
  const localRedirects = [
    { label: "trailing slash /about", source: "/about", expectedFinalPath: "/about/" },
    { label: "trailing slash calculator", source: "/calculators/wedding-cost", expectedFinalPath: "/calculators/wedding-cost/" },
    { label: "trailing slash guide", source: "/guides/newlywed-budget-guide", expectedFinalPath: "/guides/newlywed-budget-guide/" },
  ];

  for (const item of localRedirects) {
    const response = await tracedFetch(item.source, { readBody: false });
    const expectedFinal = new URL(item.expectedFinalPath, baseUrl).toString();
    addCheck(item.label, item.source, response.chain.length === 1 && response.status === 200 && response.finalUrl === expectedFinal, `chain=${response.chain.length}, final=${response.finalUrl}`, response.status);
  }

  if (baseUrl.origin === canonicalOrigin) {
    const productionRedirects = [
      { label: "http to https", source: "http://weddingbudget.co.kr/about", expected: `${canonicalOrigin}/about/` },
      { label: "www to non-www", source: "https://www.weddingbudget.co.kr/about", expected: `${canonicalOrigin}/about/` },
      { label: "http www to canonical", source: "http://www.weddingbudget.co.kr/about", expected: `${canonicalOrigin}/about/` },
    ];

    for (const item of productionRedirects) {
      const response = await tracedFetch(item.source, { readBody: false });
      addCheck(item.label, item.source, response.chain.length <= 1 && response.status === 200 && response.finalUrl === item.expected, `chain=${response.chain.length}, final=${response.finalUrl}`, response.status);
    }
  }
}

async function main() {
  const robots = await tracedFetch("/robots.txt");
  addCheck("robots.txt returns 200", "/robots.txt", robots.status === 200, "", robots.status);
  addCheck("robots.txt content-type text/plain", "/robots.txt", (robots.headers["content-type"] || "").includes("text/plain"), robots.headers["content-type"] || "missing");
  addCheck("robots.txt allows site", "/robots.txt", /User-agent:\s*\*/i.test(robots.body) && /Allow:\s*\//i.test(robots.body));
  addCheck("robots.txt does not block all", "/robots.txt", !/Disallow:\s*\/(?:\s|$)/i.test(robots.body));
  addCheck("robots.txt sitemap canonical", "/robots.txt", robots.body.includes(`Sitemap: ${canonicalOrigin}/sitemap.xml`));
  addCheck("robots.txt does not block summary", "/robots.txt", !/Disallow:\s*\/summary\/?/i.test(robots.body));

  const sitemap = await tracedFetch("/sitemap.xml");
  addCheck("sitemap.xml returns 200", "/sitemap.xml", sitemap.status === 200, "", sitemap.status);
  addCheck("sitemap.xml content-type XML", "/sitemap.xml", /(xml|text\/xml|application\/octet-stream)/i.test(sitemap.headers["content-type"] || ""), sitemap.headers["content-type"] || "missing");
  addCheck("sitemap.xml has urlset", "/sitemap.xml", /<urlset\b/i.test(sitemap.body));

  const sitemapUrls = parseSitemapUrls(sitemap.body);
  const uniqueUrls = new Set(sitemapUrls);
  addCheck("sitemap URL list is unique", "/sitemap.xml", sitemapUrls.length === uniqueUrls.size, `count=${sitemapUrls.length}, unique=${uniqueUrls.size}`);
  addCheck("sitemap URLs use canonical origin", "/sitemap.xml", sitemapUrls.every((url) => url.startsWith(`${canonicalOrigin}/`)));
  addCheck("sitemap URLs use trailing slash pages", "/sitemap.xml", sitemapUrls.every((url) => {
    const parsed = new URL(url);
    return parsed.pathname === "/" || parsed.pathname.endsWith("/");
  }));

  for (const loc of sitemapUrls) {
    await auditIndexablePage(loc);
  }

  await auditSummary(sitemapUrls);
  await auditQueryUrls(sitemapUrls);
  await auditRedirects();

  const result = {
    baseUrl: baseUrl.origin,
    canonicalOrigin,
    checkedAt: new Date().toISOString(),
    sitemapUrlCount: sitemapUrls.length,
    issueCount: issues.length,
    checks,
    issues,
  };
  writeFileSync(resultPath, `${JSON.stringify(result, null, 2)}\n`);

  console.table(checks.map((item) => ({
    Check: item.check,
    Target: item.target,
    Status: item.status,
    Result: item.result,
    Detail: item.detail,
  })));

  if (issues.length) {
    console.error(`SEO audit failed with ${issues.length} issue(s). See ${resultPath}.`);
    process.exit(1);
  }

  console.log(`SEO audit passed for ${sitemapUrls.length} sitemap URL(s). Result written to ${resultPath}.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
