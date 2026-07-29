import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";

const outputDir = join(process.cwd(), "public", "og");

const pages = [
  {
    file: "home.png",
    title: "웨딩 예산 계산기",
    subtitle: "결혼식·스드메·혼수·신혼집 비용 허브",
    rows: [
      ["결혼식", "웨딩홀·식대"],
      ["스드메", "원본·헬퍼비"],
      ["혼수", "가전·가구"],
      ["신혼집", "초기비용·월 고정비"],
    ],
    total: "PDF · 엑셀 · 공유 링크",
    accent: "#0f172a",
  },
  {
    file: "wedding-cost.png",
    title: "결혼식 예산표",
    subtitle: "웨딩홀부터 혼수까지 총예산 계산",
    rows: [
      ["웨딩홀", "15,600,000원"],
      ["스드메", "3,500,000원"],
      ["혼수", "12,000,000원"],
      ["축의금 반영", "-9,000,000원"],
    ],
    total: "실제 부담액 비교",
    accent: "#be123c",
  },
  {
    file: "honsu-budget.png",
    title: "혼수 예산표",
    subtitle: "신혼 가전·가구 필수/선택 비교",
    rows: [
      ["필수 가전", "4,300,000원"],
      ["필수 가구", "2,000,000원"],
      ["선택 품목", "3,250,000원"],
      ["목표 예산 차이", "확인"],
    ],
    total: "필수 합계와 선택 합계",
    accent: "#047857",
  },
  {
    file: "studio-dress-makeup-cost.png",
    title: "스드메 견적 계산기",
    subtitle: "기본 패키지와 추가금 비교",
    rows: [
      ["기본 패키지", "3,200,000원"],
      ["원본·헬퍼비", "650,000원"],
      ["드레스 추가금", "700,000원"],
      ["업체 A/B/C", "최종 합계"],
    ],
    total: "견적표 PDF 저장",
    accent: "#7c3aed",
  },
  {
    file: "wedding-hall-cost.png",
    title: "웨딩홀 보증인원",
    subtitle: "식대와 결혼식장 총비용 계산",
    rows: [
      ["보증 인원", "150명"],
      ["예상 하객", "180명"],
      ["식대 총액", "12,600,000원"],
      ["순부담액", "축의금 반영"],
    ],
    total: "최소 청구액 확인",
    accent: "#0369a1",
  },
  {
    file: "newlywed-home-budget.png",
    title: "신혼집 예산표",
    subtitle: "이사·대출·인테리어·가전 초기비용",
    rows: [
      ["초기 현금", "95,000,000원"],
      ["월 고정비", "1,530,000원"],
      ["이사·청소", "1,650,000원"],
      ["가전·가구", "15,000,000원"],
    ],
    total: "초기비용과 월 고정비",
    accent: "#b45309",
  },
];

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderHtml(page) {
  const rows = page.rows
    .map(([label, value]) => `
      <div class="row">
        <span>${escapeHtml(label)}</span>
        <strong>${escapeHtml(value)}</strong>
      </div>
    `)
    .join("");

  return `<!doctype html>
    <html lang="ko">
      <head>
        <meta charset="utf-8" />
        <style>
          * { box-sizing: border-box; }
          body {
            margin: 0;
            width: 1200px;
            height: 630px;
            background: #f8fafc;
            color: #0f172a;
            font-family: -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Noto Sans KR", "Segoe UI", sans-serif;
          }
          .canvas {
            display: grid;
            grid-template-columns: 1fr 440px;
            gap: 44px;
            width: 100%;
            height: 100%;
            padding: 72px;
            border-top: 18px solid ${page.accent};
          }
          .brand {
            color: ${page.accent};
            font-size: 28px;
            font-weight: 800;
          }
          h1 {
            margin: 44px 0 0;
            font-size: 72px;
            line-height: 1.08;
            letter-spacing: 0;
          }
          p {
            margin: 26px 0 0;
            color: #475569;
            font-size: 32px;
            line-height: 1.38;
            font-weight: 700;
          }
          .panel {
            align-self: center;
            border: 2px solid #e2e8f0;
            border-radius: 28px;
            background: white;
            padding: 28px;
            box-shadow: 0 24px 60px rgba(15, 23, 42, 0.12);
          }
          .panel-title {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 18px;
            color: #475569;
            font-size: 22px;
            font-weight: 800;
          }
          .dot {
            width: 20px;
            height: 20px;
            border-radius: 999px;
            background: ${page.accent};
          }
          .rows {
            display: grid;
            gap: 14px;
            margin-top: 22px;
          }
          .row {
            display: flex;
            justify-content: space-between;
            gap: 18px;
            border: 2px solid #e2e8f0;
            border-radius: 18px;
            padding: 18px;
            font-size: 22px;
          }
          .row span { color: #475569; font-weight: 700; }
          .row strong { color: #0f172a; text-align: right; }
          .total {
            margin-top: 22px;
            border-radius: 18px;
            background: ${page.accent};
            color: white;
            padding: 20px;
            font-size: 24px;
            font-weight: 900;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <main class="canvas">
          <section>
            <div class="brand">weddingbudget.co.kr</div>
            <h1>${escapeHtml(page.title)}</h1>
            <p>${escapeHtml(page.subtitle)}</p>
          </section>
          <section class="panel" aria-label="예산표 예시">
            <div class="panel-title">
              <span>계산표 예시</span>
              <span class="dot"></span>
            </div>
            <div class="rows">${rows}</div>
            <div class="total">${escapeHtml(page.total)}</div>
          </section>
        </main>
      </body>
    </html>`;
}

async function main() {
  mkdirSync(outputDir, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });

  for (const ogPage of pages) {
    await page.setContent(renderHtml(ogPage), { waitUntil: "networkidle" });
    await page.screenshot({ path: join(outputDir, ogPage.file), type: "png" });
  }

  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
