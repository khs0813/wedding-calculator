import { devices, expect, type Browser, type BrowserContextOptions, type Page, test } from "@playwright/test";

type MobileDevice = {
  name: string;
  contextOptions: BrowserContextOptions;
};

const baseURL = "http://127.0.0.1:4174";
const routesToCheck = [
  "/",
  "/calculators/",
  "/calculators/wedding-cost/",
  "/calculators/newlywed-home-budget/",
  "/guides/",
  "/guides/wedding-guest-budget-table-guide/",
  "/summary/",
];

function createMobileDevice(name: "Pixel 7" | "iPhone 15"): MobileDevice {
  const { defaultBrowserType: _defaultBrowserType, ...contextOptions } = devices[name];

  return {
    name,
    contextOptions,
  };
}

async function newMobilePage(browser: Browser, mobileDevice: MobileDevice) {
  const context = await browser.newContext({
    ...mobileDevice.contextOptions,
    baseURL,
  });
  const page = await context.newPage();

  page.on("console", (message) => {
    if (message.type() === "error") {
      throw new Error(`Console error: ${message.text()}`);
    }
  });

  return { context, page };
}

async function expectNoHorizontalOverflow(page: Page) {
  await page.waitForLoadState("networkidle");
  const result = await page.evaluate(() => {
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

    return {
      viewportWidth,
      documentWidth,
      offenders,
    };
  });

  expect(result.documentWidth, JSON.stringify(result, null, 2)).toBeLessThanOrEqual(result.viewportWidth + 2);
  expect(result.offenders, JSON.stringify(result, null, 2)).toHaveLength(0);
}

async function expectMinTouchHeight(page: Page, selector: string) {
  const boxes = await page.locator(selector).evaluateAll((elements) =>
    elements
      .flatMap((element) => {
        const rect = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);

        if (rect.width <= 0 || rect.height <= 0 || style.display === "none" || style.visibility === "hidden") {
          return [];
        }

        return [{
          text: element.textContent?.trim().replace(/\s+/g, " ") || element.getAttribute("aria-label") || selector,
          height: Math.round(rect.height),
        }];
      }),
  );

  for (const box of boxes) {
    expect(box.height, `${selector}: ${box.text}`).toBeGreaterThanOrEqual(44);
  }
}

const mobileDevices = [
  createMobileDevice("Pixel 7"),
  createMobileDevice("iPhone 15"),
];

for (const mobileDevice of mobileDevices) {
  test.describe(`${mobileDevice.name} mobile UX`, () => {
    test("public pages do not create document-level horizontal scroll", async ({ browser }) => {
      const { context, page } = await newMobilePage(browser, mobileDevice);

      for (const route of routesToCheck) {
        await page.goto(route);
        await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
        await expectNoHorizontalOverflow(page);
      }

      await context.close();
    });

    test("calculator controls remain tappable after showing results", async ({ browser }) => {
      const { context, page } = await newMobilePage(browser, mobileDevice);

      await page.goto("/calculators/wedding-cost/");
      await expectNoHorizontalOverflow(page);
      await expectMinTouchHeight(page, "header a[href='/']");
      await expectMinTouchHeight(page, "header a[href='/calculators/wedding-cost/']");
      await expectMinTouchHeight(page, "nav[aria-label='모바일 주요 메뉴'] a");
      await expectMinTouchHeight(page, "button[aria-pressed]");

      await page.getByRole("button", { name: "평균형" }).click();
      await expect(page.getByText("예상 총액", { exact: true })).toBeVisible();
      await expectNoHorizontalOverflow(page);
      await expectMinTouchHeight(page, "a[href='#budget-insights']");

      await context.close();
    });
  });
}
