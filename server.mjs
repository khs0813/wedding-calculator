import { createReadStream, existsSync, readFileSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { createServer } from "node:http";

const rootDir = join(process.cwd(), "out");
const port = Number(process.env.PORT || 3000);
const canonicalSiteUrl = new URL("https://weddingbudget.co.kr");
const trailingSlashExcludedExactPaths = new Set([
  "/ads.txt",
  "/apple-touch-icon.png",
  "/favicon.ico",
  "/favicon.svg",
  "/manifest",
  "/manifest.json",
  "/manifest.webmanifest",
  "/robots.txt",
  "/rss.xml",
  "/service-worker",
  "/service-worker.js",
  "/sitemap.xml",
  "/sw",
  "/sw.js",
  "/workbox",
  "/workbox.js",
]);
const trailingSlashExcludedPrefixes = ["/api", "/_next", "/static", "/assets", "/images", "/fonts", "/.well-known"];

const contentTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "application/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".xml", "application/xml; charset=utf-8"],
  [".txt", "text/plain; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".webp", "image/webp"],
  [".gif", "image/gif"],
  [".ico", "image/x-icon"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"],
]);

const securityHeaders = {
  "Content-Security-Policy-Report-Only":
    "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; img-src 'self' data: https:; font-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' https:; connect-src 'self' https:; frame-src https:",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-DNS-Prefetch-Control": "on",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Resource-Policy": "same-origin",
  "Origin-Agent-Cluster": "?1",
  "X-Permitted-Cross-Domain-Policies": "none",
  "X-XSS-Protection": "0",
};

function parseRequestUrl(urlString = "/") {
  const normalizedUrlString = urlString.startsWith("//") ? `/${urlString.replace(/^\/+/, "")}` : urlString;
  return new URL(normalizedUrlString, "http://localhost");
}

function safePathname(urlString = "/") {
  const pathname = parseRequestUrl(urlString).pathname;
  const decoded = decodeURIComponent(pathname);
  const normalizedPath = normalize(decoded).replace(/^(\.\.[/\\])+/, "").replace(/\/{2,}/g, "/");
  return normalizedPath === "." ? "/" : normalizedPath;
}

function resolveFile(pathname) {
  const directPath = join(rootDir, pathname);

  if (existsSync(directPath) && statSync(directPath).isFile()) {
    return directPath;
  }

  const withoutLeadingSlash = pathname.replace(/^\/+/, "");
  const indexCandidate = join(rootDir, withoutLeadingSlash, "index.html");

  if (existsSync(indexCandidate) && statSync(indexCandidate).isFile()) {
    return indexCandidate;
  }

  const htmlCandidate = join(rootDir, `${withoutLeadingSlash}.html`);
  if (existsSync(htmlCandidate) && statSync(htmlCandidate).isFile()) {
    return htmlCandidate;
  }

  return null;
}

function isPagePathWithoutTrailingSlash(pathname) {
  return isHtmlPagePathname(pathname) && !pathname.endsWith("/");
}

function isHtmlPagePathname(pathname) {
  if (pathname === "/") {
    return true;
  }

  if (trailingSlashExcludedExactPaths.has(pathname)) {
    return false;
  }

  if (trailingSlashExcludedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    return false;
  }

  return !extname(pathname);
}

function isLocalHostname(hostname) {
  return ["localhost", "127.0.0.1", "::1"].includes(hostname);
}

function forwardedProtocol(req) {
  const value = req.headers["x-forwarded-proto"];
  if (!value) {
    return null;
  }

  return (Array.isArray(value) ? value[0] : value).split(",")[0]?.trim() || null;
}

function canonicalPathname(pathname) {
  const normalizedPathname = pathname.replace(/\/{2,}/g, "/");
  return isPagePathWithoutTrailingSlash(normalizedPathname) ? `${normalizedPathname}/` : normalizedPathname;
}

function canonicalRedirectLocation(req, pathname) {
  const requestUrl = parseRequestUrl(req.url || "/");
  const targetPathname = canonicalPathname(pathname);
  const host = req.headers.host?.split(":")[0];
  const protocol = forwardedProtocol(req);
  const shouldUseCanonicalOrigin =
    host &&
    !isLocalHostname(host) &&
    (host !== canonicalSiteUrl.hostname ||
      (protocol !== null && protocol !== canonicalSiteUrl.protocol.replace(":", "")));
  const shouldUseCanonicalPath = targetPathname !== requestUrl.pathname;

  if (!shouldUseCanonicalOrigin && !shouldUseCanonicalPath) {
    return null;
  }

  const targetPathAndQuery = `${targetPathname}${requestUrl.search}`;
  return shouldUseCanonicalOrigin ? `${canonicalSiteUrl.origin}${targetPathAndQuery}` : targetPathAndQuery;
}

function isHtmlPageResponse(filePath, pathname) {
  return extname(filePath).toLowerCase() === ".html" && !extname(pathname);
}

function shouldNoindexRequest(pathname, search) {
  if (pathname === "/summary" || pathname === "/summary/") {
    return true;
  }

  return Boolean(search) && !extname(pathname);
}

function withRobotsMeta(html, content) {
  const robotsMeta = `<meta name="robots" content="${content}"/>`;
  const replaced = html.replace(/<meta\s+name=["']robots["']\s+content=["'][^"']*["']\s*\/?>/i, robotsMeta);

  if (replaced !== html) {
    return replaced;
  }

  return html.replace(/<head>/i, `<head>${robotsMeta}`);
}

function sendFile(res, filePath, statusCode, pathname = "", search = "") {
  const extension = extname(filePath).toLowerCase();
  const contentType = contentTypes.get(extension) || "application/octet-stream";
  const isCrawlerControlFile = pathname === "/robots.txt" || pathname === "/sitemap.xml";
  const shouldNoindex = statusCode === 200 && isHtmlPageResponse(filePath, pathname) && shouldNoindexRequest(pathname, search);
  const extraHeaders = shouldNoindex
    ? { "X-Robots-Tag": "noindex, follow" }
    : {};

  res.writeHead(statusCode, {
    "Content-Type": contentType,
    "Cache-Control": extension === ".html" || isCrawlerControlFile ? "no-cache" : "public, max-age=31536000, immutable",
    ...securityHeaders,
    ...extraHeaders,
  });

  if (shouldNoindex) {
    res.end(withRobotsMeta(readFileSync(filePath, "utf8"), "noindex, follow"));
    return;
  }

  createReadStream(filePath).pipe(res);
}

createServer((req, res) => {
  const pathname = safePathname(req.url);
  const redirectLocation = canonicalRedirectLocation(req, pathname);
  if (redirectLocation) {
    res.writeHead(301, {
      Location: redirectLocation,
      ...securityHeaders,
    });
    res.end();
    return;
  }

  const matchedFile = resolveFile(pathname);

  if (matchedFile) {
    const requestUrl = new URL(req.url || "/", "http://localhost");
    sendFile(res, matchedFile, 200, pathname, requestUrl.search);
    return;
  }

  const notFoundFile = join(rootDir, "404.html");
  if (existsSync(notFoundFile)) {
    sendFile(res, notFoundFile, 404, pathname);
    return;
  }

  res.writeHead(404, {
    "Content-Type": "text/plain; charset=utf-8",
    ...securityHeaders,
  });
  res.end("Not Found");
}).listen(port, "0.0.0.0", () => {
  console.log(`Serving static export from ${rootDir} on port ${port}`);
});
