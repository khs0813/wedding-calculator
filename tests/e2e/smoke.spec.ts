import { expect, type Page, test } from "@playwright/test";
import { readFile } from "node:fs/promises";
import path from "node:path";

const calculators = [
  { path: "/calculators/wedding-cost/", preset: "평균형" },
  { path: "/calculators/newlywed-home-budget/", preset: "전세 중심" },
  { path: "/calculators/wedding-hall-cost/", preset: "150명 기준" },
  { path: "/calculators/studio-dress-makeup-cost/", preset: "균형형" },
  { path: "/calculators/honsu-budget/", preset: "균형형" },
  { path: "/calculators/wedding-gift-budget/", preset: "보통형" },
  { path: "/calculators/honeymoon-budget/", preset: "아시아권" },
  { path: "/calculators/congratulatory-money/", preset: "일반 친구/동료" },
];

test.beforeEach(async ({ page }) => {
  page.on("console", (message) => {
    if (message.type() === "error") {
      throw new Error(`Console error: ${message.text()}`);
    }
  });
  await page.goto("/");
  await page.evaluate(() => window.localStorage.clear());
});

async function applyPresetAndExpectResult(page: Page, preset: string) {
  await page.getByRole("button", { name: preset }).click();
  await expect(page.getByText("예상 총액", { exact: true })).toBeVisible();
  await expect(page.getByText(/원/).first()).toBeVisible();
}

async function expectXlsxDownload(downloadPath: string) {
  const buffer = await readFile(downloadPath);
  expect(buffer[0]).toBe(0x50);
  expect(buffer[1]).toBe(0x4b);
  expect(buffer.toString("utf8")).toContain("[Content_Types].xml");
}

async function fillLabeledInput(page: Page, label: string, value: string) {
  await page.getByLabel(label, { exact: true }).fill(value);
}

test("public pages, calculators, storage, summary, share URL, and XLSX download work", async ({ browser, context, page }, testInfo) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);

  await page.goto("/");
  await expect(page.getByRole("link", { name: "계산기" }).first()).toBeVisible();

  await page.goto("/calculators/");
  await expect(page.getByRole("heading", { name: "예산 계산기", exact: true })).toBeVisible();

  for (const calculator of calculators) {
    await page.goto(calculator.path);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await applyPresetAndExpectResult(page, calculator.preset);
    await page.waitForTimeout(350);
    await page.reload();
    await expect(page.getByText("예상 총액", { exact: true })).toBeVisible();
  }

  await page.goto("/summary/");
  await expect(page.locator("table").getByText("입력됨")).toHaveCount(calculators.length);

  await page.goto(calculators[0].path);
  await applyPresetAndExpectResult(page, calculators[0].preset);
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "상대와 공유하기" }).click();
  const copiedUrl = await page.evaluate(() => navigator.clipboard.readText());
  expect(copiedUrl).toContain("#state=");

  const sharedContext = await browser.newContext();
  const sharedPage = await sharedContext.newPage();
  await sharedPage.goto(copiedUrl);
  await expect(sharedPage.getByText("공유 URL의 입력값을 복원했습니다.")).toBeVisible();
  await expect(sharedPage.getByText("예상 총액", { exact: true })).toBeVisible();
  await sharedContext.close();

  await page.locator("summary").filter({ hasText: "엑셀 내보내기" }).click();
  const download = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "엑셀 내보내기" }).click(),
  ]).then(([file]) => file);
  const downloadPath = path.join(testInfo.outputDir, await download.suggestedFilename());
  await download.saveAs(downloadPath);
  await expectXlsxDownload(downloadPath);

  await page.evaluate(() => {
    (window as typeof window & { __printCalled?: boolean }).__printCalled = false;
    window.print = () => {
      (window as typeof window & { __printCalled?: boolean }).__printCalled = true;
    };
  });
  await page.getByRole("button", { name: "PDF 저장" }).click();
  await expect.poll(() => page.evaluate(() => (window as typeof window & { __printCalled?: boolean }).__printCalled)).toBe(true);

  await page.goto("/summary/");
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "초기화" }).click();
  await expect(page.getByText("저장된 계산 결과가 아직 없습니다.")).toBeVisible();
});

test("calculator formulas cover wedding hall guest boundary and newlywed home cash flow", async ({ page }) => {
  await page.goto("/calculators/wedding-hall-cost/");
  await fillLabeledInput(page, "보증 인원", "150");
  await fillLabeledInput(page, "예상 하객 수", "120");
  await fillLabeledInput(page, "식대 1인당 비용", "70000");
  await fillLabeledInput(page, "대관료", "1000000");
  await expect(page.getByText("10,500,000원").first()).toBeVisible();
  await expect(page.getByLabel("핵심 지표").getByText("150명 기준")).toBeVisible();
  await expect(page.getByText("11,500,000원").first()).toBeVisible();

  await page.goto("/calculators/newlywed-home-budget/");
  await fillLabeledInput(page, "전세보증금 또는 매매가", "300000000");
  await fillLabeledInput(page, "월세", "500000");
  await fillLabeledInput(page, "관리비", "200000");
  await fillLabeledInput(page, "인테리어 비용", "0");
  await fillLabeledInput(page, "가전 구매 비용", "10000000");
  await fillLabeledInput(page, "가구 구매 비용", "5000000");
  await page.locator("summary").filter({ hasText: "상세 항목 열기" }).click();
  await fillLabeledInput(page, "이사 비용", "1000000");
  await fillLabeledInput(page, "입주청소 비용", "500000");
  await fillLabeledInput(page, "인터넷/TV 설치비", "100000");
  await fillLabeledInput(page, "생활용품 초기 구매비", "1000000");
  await fillLabeledInput(page, "대출금", "200000000");
  await fillLabeledInput(page, "대출금리", "0");
  await fillLabeledInput(page, "대출기간", "20");
  await expect(page.getByText("117,600,000원").first()).toBeVisible();
  await expect(page.getByText("1,533,333원").first()).toBeVisible();
  await expect(page.getByText("833,333원").first()).toBeVisible();
});

test("SEO controls expose summary noindex and trailing-slash canonical redirects", async ({ request }) => {
  const summary = await request.get("/summary/");
  expect(summary.ok()).toBe(true);
  expect(summary.headers()["x-robots-tag"]).toBe("noindex, follow");
  expect(await summary.text()).toContain('<meta name="robots" content="noindex, follow"/>');

  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBe(true);
  expect(await sitemap.text()).not.toContain("/summary/");

  const response = await request.get("/guides/newlywed-budget-guide", { maxRedirects: 0 });
  expect(response.status()).toBe(301);
  expect(response.headers()["location"]).toBe("/guides/newlywed-budget-guide/");
});
