import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { createServer } from "node:http";

const rootDir = join(process.cwd(), "out");
const port = Number(process.env.PORT || 3000);
const canonicalSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL) : null;

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
  "Content-Security-Policy":
    "default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'; script-src-attr 'none'; script-src 'self' 'unsafe-inline' https://pagead2.googlesyndication.com https://*.googlesyndication.com https://*.googleadservices.com https://www.googletagmanager.com https://www.google-analytics.com https://*.doubleclick.net; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; media-src 'self'; connect-src 'self' https://*.googlesyndication.com https://*.googleadservices.com https://*.google-analytics.com https://*.doubleclick.net https://www.google.com https://google.com; frame-src https://*.googlesyndication.com https://*.doubleclick.net https://www.google.com; worker-src 'self' blob:; manifest-src 'self'; upgrade-insecure-requests",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-DNS-Prefetch-Control": "on",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=(), bluetooth=(), clipboard-write=(self)",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Resource-Policy": "same-origin",
  "Origin-Agent-Cluster": "?1",
  "X-Permitted-Cross-Domain-Policies": "none",
  "X-XSS-Protection": "0",
};

function safePathname(urlString = "/") {
  const pathname = new URL(urlString, "http://localhost").pathname;
  const decoded = decodeURIComponent(pathname);
  const normalizedPath = normalize(decoded).replace(/^(\.\.[/\\])+/, "");
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

function sendFile(res, filePath, statusCode, pathname = "") {
  const extension = extname(filePath).toLowerCase();
  const contentType = contentTypes.get(extension) || "application/octet-stream";
  const isCrawlerControlFile = pathname === "/robots.txt" || pathname === "/sitemap.xml";
  const extraHeaders = pathname === "/summary" || pathname === "/summary/"
    ? { "X-Robots-Tag": "noindex, follow" }
    : {};

  res.writeHead(statusCode, {
    "Content-Type": contentType,
    "Cache-Control": extension === ".html" || isCrawlerControlFile ? "no-cache" : "public, max-age=31536000, immutable",
    ...securityHeaders,
    ...extraHeaders,
  });
  createReadStream(filePath).pipe(res);
}

createServer((req, res) => {
  const host = req.headers.host?.split(":")[0];
  if (
    canonicalSiteUrl &&
    host &&
    host.endsWith(".onrender.com") &&
    host !== canonicalSiteUrl.hostname
  ) {
    res.writeHead(301, {
      Location: `${canonicalSiteUrl.origin}${req.url || "/"}`,
      ...securityHeaders,
    });
    res.end();
    return;
  }

  const pathname = safePathname(req.url);
  const matchedFile = resolveFile(pathname);

  if (matchedFile) {
    sendFile(res, matchedFile, 200, pathname);
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
