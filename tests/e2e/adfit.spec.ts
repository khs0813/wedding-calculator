import { expect, test } from "@playwright/test";

const adFitSdkUrl = "https://t1.kakaocdn.net/kas/static/ba.min.js";
const documentPositionFollowing = 4;
const responsiveViewports = [
  { width: 320, height: 568 },
  { width: 360, height: 800 },
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1280, height: 800 },
  { width: 1440, height: 900 },
];

const responsiveRoutes = [
  "/",
  "/calculators/wedding-cost/",
  "/calculators/congratulatory-money/",
  "/guides/",
  "/guides/wedding-cost-guide/",
  "/summary/",
  "/privacy/",
];

function collectDocumentOverflow() {
  function hasScrollableAncestor(element: Element) {
    let current = element.parentElement;

    while (current && current !== document.body) {
      const style = window.getComputedStyle(current);
      const canScrollHorizontally =
        (style.overflowX === "auto" || style.overflowX === "scroll") &&
        current.scrollWidth > current.clientWidth;

      if (canScrollHorizontally) {
        return true;
      }

      current = current.parentElement;
    }

    return false;
  }

  const viewportWidth = window.innerWidth;
  const documentWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
  const offenders = Array.from(document.querySelectorAll("body *"))
    .map((element) => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);

      if (
        rect.width <= 0 ||
        rect.height <= 0 ||
        style.display === "none" ||
        style.visibility === "hidden" ||
        hasScrollableAncestor(element)
      ) {
        return null;
      }

      if (rect.left < -1 || rect.right > viewportWidth + 1) {
        return {
          tagName: element.tagName.toLowerCase(),
          className: element.getAttribute("class") || "",
          text: element.textContent?.trim().replace(/\s+/g, " ").slice(0, 80) || "",
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width),
        };
      }

      return null;
    })
    .filter(Boolean)
    .slice(0, 5);

  return { viewportWidth, documentWidth, offenders };
}

test("AdFit is not requested on local or disabled environments", async ({ page }) => {
  const adFitRequests: string[] = [];
  page.on("request", (request) => {
    if (request.url() === adFitSdkUrl) {
      adFitRequests.push(request.url());
    }
  });

  for (const route of ["/", "/calculators/", "/guides/", "/privacy/", "/summary/"]) {
    await page.goto(route);
    await expect(page.locator("ins.kakao_ad_area")).toHaveCount(0);
    await expect(page.locator(`script[src="${adFitSdkUrl}"]`)).toHaveCount(0);
  }

  await page.goto("/calculators/wedding-cost/");
  await expect(page.locator("ins.kakao_ad_area")).toHaveCount(0);
  await page.getByRole("button", { name: "평균형" }).click();
  await expect(page.getByText("예상 총액", { exact: true })).toBeVisible();
  await expect(page.locator("ins.kakao_ad_area")).toHaveCount(0);
  await expect(page.locator(`script[src="${adFitSdkUrl}"]`)).toHaveCount(0);
  expect(adFitRequests).toHaveLength(0);
});

test("calculator result summary appears before details and result actions", async ({ page }) => {
  await page.goto("/calculators/wedding-cost/");
  await page.getByRole("button", { name: "평균형" }).click();

  const summary = page.getByRole("heading", { name: "예상 총액" });
  const details = page.getByRole("heading", { name: "예산 검토" });
  const actions = page.getByRole("heading", { name: "결과 저장과 공유" });

  await expect(summary).toBeVisible();
  await expect(details).toBeVisible();
  await expect(actions).toBeVisible();

  const order = await page.evaluate(() => {
    const summaryElement = [...document.querySelectorAll("h2")].find((element) => element.textContent?.trim() === "예상 총액");
    const detailsElement = [...document.querySelectorAll("h2")].find((element) => element.textContent?.trim() === "예산 검토");
    const actionsElement = [...document.querySelectorAll("h2")].find((element) => element.textContent?.trim() === "결과 저장과 공유");

    return {
      summary: summaryElement?.compareDocumentPosition(detailsElement || document.body),
      details: detailsElement?.compareDocumentPosition(actionsElement || document.body),
    };
  });

  expect(order.summary && (order.summary & documentPositionFollowing)).toBeTruthy();
  expect(order.details && (order.details & documentPositionFollowing)).toBeTruthy();
});

test("key pages stay within the viewport across mobile and desktop sizes", async ({ page }) => {
  for (const viewport of responsiveViewports) {
    await page.setViewportSize(viewport);

    for (const route of responsiveRoutes) {
      await page.goto(route);
      await page.waitForLoadState("networkidle");
      await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
      await expect(page.locator("ins.kakao_ad_area")).toHaveCount(0);

      const result = await page.evaluate(collectDocumentOverflow);
      expect(result.documentWidth, `${route} ${viewport.width}x${viewport.height} ${JSON.stringify(result)}`).toBeLessThanOrEqual(result.viewportWidth + 2);
      expect(result.offenders, `${route} ${viewport.width}x${viewport.height} ${JSON.stringify(result)}`).toHaveLength(0);
    }
  }
});
