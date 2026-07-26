# SEO Indexing Report

기준 도메인: `https://weddingbudget.co.kr`

정규 URL 형식: Next.js `trailingSlash: true`와 내부 링크/사이트맵/캐노니컬을 모두 맞춰 페이지 URL은 `/path/` 형식으로 통일한다. 루트(`/`)와 파일 URL(`/robots.txt`, `/sitemap.xml`, `/rss.xml`)은 예외다.

공유 URL 확인 결과: 계산기 공유 기능은 query string이 아니라 hash fragment `#state=...`를 사용한다. fragment는 HTTP 요청에 포함되지 않으므로 서버 HTML, canonical, Open Graph URL, structured data에 공유 입력값이 들어가지 않는다. 감사 목적의 `?state=...` 같은 query URL은 custom server에서 `noindex, follow`로 처리하고 canonical은 query 없는 계산기 URL로 둔다.

| URL 패턴 | 색인 여부 | canonical 대상 | sitemap 포함 여부 | robots 정책 | 이유 |
|---|---:|---|---:|---|---|
| `/` | INDEXABLE | `https://weddingbudget.co.kr/` | 예 | `index, follow` | 홈페이지, 공개 검색 진입점 |
| `/calculators/` | INDEXABLE | `https://weddingbudget.co.kr/calculators/` | 예 | `index, follow` | 계산기 허브 페이지 |
| `/calculators/wedding-cost/` | INDEXABLE | `https://weddingbudget.co.kr/calculators/wedding-cost/` | 예 | `index, follow` | 공개 결혼 비용 계산기 |
| `/calculators/newlywed-home-budget/` | INDEXABLE | `https://weddingbudget.co.kr/calculators/newlywed-home-budget/` | 예 | `index, follow` | 공개 신혼집 예산 계산기 |
| `/calculators/wedding-hall-cost/` | INDEXABLE | `https://weddingbudget.co.kr/calculators/wedding-hall-cost/` | 예 | `index, follow` | 공개 웨딩홀 비용 계산기 |
| `/calculators/studio-dress-makeup-cost/` | INDEXABLE | `https://weddingbudget.co.kr/calculators/studio-dress-makeup-cost/` | 예 | `index, follow` | 공개 스드메 비용 계산기 |
| `/calculators/honsu-budget/` | INDEXABLE | `https://weddingbudget.co.kr/calculators/honsu-budget/` | 예 | `index, follow` | 공개 혼수 비용 계산기 |
| `/calculators/wedding-gift-budget/` | INDEXABLE | `https://weddingbudget.co.kr/calculators/wedding-gift-budget/` | 예 | `index, follow` | 공개 예물 예산 계산기 |
| `/calculators/honeymoon-budget/` | INDEXABLE | `https://weddingbudget.co.kr/calculators/honeymoon-budget/` | 예 | `index, follow` | 공개 신혼여행 예산 계산기 |
| `/calculators/congratulatory-money/` | INDEXABLE | `https://weddingbudget.co.kr/calculators/congratulatory-money/` | 예 | `index, follow` | 공개 축의금 참고 계산기 |
| `/guides/` | INDEXABLE | `https://weddingbudget.co.kr/guides/` | 예 | `index, follow` | 가이드 허브 페이지 |
| `/guides/wedding-cost-guide/` | INDEXABLE | `https://weddingbudget.co.kr/guides/wedding-cost-guide/` | 예 | `index, follow` | 공개 가이드 |
| `/guides/newlywed-budget-guide/` | INDEXABLE | `https://weddingbudget.co.kr/guides/newlywed-budget-guide/` | 예 | `index, follow` | 공개 가이드 |
| `/guides/wedding-saving-tips/` | INDEXABLE | `https://weddingbudget.co.kr/guides/wedding-saving-tips/` | 예 | `index, follow` | 공개 가이드 |
| `/guides/wedding-hall-checklist/` | INDEXABLE | `https://weddingbudget.co.kr/guides/wedding-hall-checklist/` | 예 | `index, follow` | 공개 가이드 |
| `/guides/sdme-options-guide/` | INDEXABLE | `https://weddingbudget.co.kr/guides/sdme-options-guide/` | 예 | `index, follow` | 공개 가이드 |
| `/guides/wedding-gift-negotiation-guide/` | INDEXABLE | `https://weddingbudget.co.kr/guides/wedding-gift-negotiation-guide/` | 예 | `index, follow` | 공개 가이드 |
| `/guides/honsu-priority-guide/` | INDEXABLE | `https://weddingbudget.co.kr/guides/honsu-priority-guide/` | 예 | `index, follow` | 공개 가이드 |
| `/guides/honeymoon-destination-budget-guide/` | INDEXABLE | `https://weddingbudget.co.kr/guides/honeymoon-destination-budget-guide/` | 예 | `index, follow` | 공개 가이드 |
| `/guides/congratulatory-money-etiquette-guide/` | INDEXABLE | `https://weddingbudget.co.kr/guides/congratulatory-money-etiquette-guide/` | 예 | `index, follow` | 공개 가이드 |
| `/guides/wedding-budget-timeline-guide/` | INDEXABLE | `https://weddingbudget.co.kr/guides/wedding-budget-timeline-guide/` | 예 | `index, follow` | 공개 가이드 |
| `/guides/small-wedding-budget-guide/` | INDEXABLE | `https://weddingbudget.co.kr/guides/small-wedding-budget-guide/` | 예 | `index, follow` | 공개 가이드 |
| `/guides/newlywed-loan-planning-guide/` | INDEXABLE | `https://weddingbudget.co.kr/guides/newlywed-loan-planning-guide/` | 예 | `index, follow` | 공개 가이드 |
| `/guides/wedding-contract-check-guide/` | INDEXABLE | `https://weddingbudget.co.kr/guides/wedding-contract-check-guide/` | 예 | `index, follow` | 공개 가이드 |
| `/guides/wedding-guest-budget-table-guide/` | INDEXABLE | `https://weddingbudget.co.kr/guides/wedding-guest-budget-table-guide/` | 예 | `index, follow` | 공개 가이드 |
| `/guides/wedding-hall-meal-cost-table-guide/` | INDEXABLE | `https://weddingbudget.co.kr/guides/wedding-hall-meal-cost-table-guide/` | 예 | `index, follow` | 공개 가이드 |
| `/guides/sdme-extra-cost-table-guide/` | INDEXABLE | `https://weddingbudget.co.kr/guides/sdme-extra-cost-table-guide/` | 예 | `index, follow` | 공개 가이드 |
| `/guides/newlywed-home-initial-cost-guide/` | INDEXABLE | `https://weddingbudget.co.kr/guides/newlywed-home-initial-cost-guide/` | 예 | `index, follow` | 공개 가이드 |
| `/guides/appliance-budget-table-guide/` | INDEXABLE | `https://weddingbudget.co.kr/guides/appliance-budget-table-guide/` | 예 | `index, follow` | 공개 가이드 |
| `/guides/honeymoon-budget-ratio-guide/` | INDEXABLE | `https://weddingbudget.co.kr/guides/honeymoon-budget-ratio-guide/` | 예 | `index, follow` | 공개 가이드 |
| `/guides/congratulatory-money-table-guide/` | INDEXABLE | `https://weddingbudget.co.kr/guides/congratulatory-money-table-guide/` | 예 | `index, follow` | 공개 가이드 |
| `/about/` | INDEXABLE | `https://weddingbudget.co.kr/about/` | 예 | `index, follow` | 사이트 소개 페이지 |
| `/methodology/` | INDEXABLE | `https://weddingbudget.co.kr/methodology/` | 예 | `index, follow` | 계산 기준 페이지 |
| `/editorial-policy/` | INDEXABLE | `https://weddingbudget.co.kr/editorial-policy/` | 예 | `index, follow` | 콘텐츠 편집 기준 페이지 |
| `/contact/` | INDEXABLE | `https://weddingbudget.co.kr/contact/` | 예 | `index, follow` | 공개 문의 페이지 |
| `/privacy/` | INDEXABLE | `https://weddingbudget.co.kr/privacy/` | 예 | `index, follow` | 공개 정책 페이지 |
| `/terms/` | INDEXABLE | `https://weddingbudget.co.kr/terms/` | 예 | `index, follow` | 공개 정책 페이지 |
| `/disclaimer/` | INDEXABLE | `https://weddingbudget.co.kr/disclaimer/` | 예 | `index, follow` | 공개 정책 페이지 |
| `/summary/` | NON_INDEXABLE | `https://weddingbudget.co.kr/summary/` | 아니오 | `noindex, follow` | 현재 브라우저에 저장된 개인 계산 결과를 모아 보는 화면 |
| `/calculators/*/?state=...` | NON_INDEXABLE | query 없는 해당 계산기 URL | 아니오 | `noindex, follow` | 실제 공유 기능은 `#state`지만, query로 입력값이 들어온 경우 색인 제외 |
| `/calculators/*/#state=...` | NON_INDEXABLE | fragment 없는 해당 계산기 URL | 아니오 | clean HTML은 `index, follow`; fragment는 서버로 전송되지 않음 | 실제 공유 URL. Googlebot이 보는 서버 URL은 clean 계산기 URL이며 공유값은 HTML/OG/JSON-LD에 포함되지 않음 |
| `/*/?utm_source=...`, `/*/?gclid=...`, `/*/?fbclid=...` | NON_INDEXABLE | query 없는 해당 페이지 URL | 아니오 | `noindex, follow` | 추적 파라미터 중복 URL 방지 |
| `/guides/?q=...` | NON_INDEXABLE | `https://weddingbudget.co.kr/guides/` | 아니오 | `noindex, follow` | 클라이언트 검색 필터 URL, 별도 검색 landing page 아님 |
| slash 없는 페이지 URL 예: `/about`, `/guides/wedding-cost-guide` | NON_INDEXABLE | trailing slash가 붙은 최종 URL | 아니오 | 301 redirect | redirect 출발 URL |
| `http://weddingbudget.co.kr/*` | NON_INDEXABLE | `https://weddingbudget.co.kr/*/` | 아니오 | 301 redirect | HTTP 출발 URL |
| `https://www.weddingbudget.co.kr/*` | NON_INDEXABLE | `https://weddingbudget.co.kr/*/` | 아니오 | 301 redirect | www 출발 URL |
| `*.onrender.com/*` | NON_INDEXABLE | `https://weddingbudget.co.kr/*/` 또는 Render 404 | 아니오 | redirect 또는 host 차단 | 배포 제공자 서브도메인 중복 방지 |
| `/rss.xml` | NON_INDEXABLE | `https://weddingbudget.co.kr/rss.xml` | 아니오 | robots 차단 없음 | RSS feed, 검색용 HTML 페이지 아님 |
| `/robots.txt` | NON_INDEXABLE | 해당 없음 | 아니오 | `Allow: /` | 크롤러 제어 파일 |
| `/sitemap.xml` | NON_INDEXABLE | 해당 없음 | 아니오 | robots 차단 없음 | sitemap 파일 자체는 sitemap에 포함하지 않음 |
| `/_next/*`, `/favicon.svg`, `/apple-touch-icon.png`, `/og-default.png`, `/ads.txt`, `/.well-known/security.txt` | NON_INDEXABLE | 해당 파일 URL | 아니오 | robots 차단 없음 | 정적 자산 및 운영 파일 |
| `/_not-found/`, `/404`, 존재하지 않는 URL | NON_INDEXABLE | 해당 없음 | 아니오 | `noindex, nofollow` 또는 404 | 삭제/오류 URL |

## Search Console Notes

- 공유 URL이 Search Console에서 `적절한 표준 태그가 포함된 대체 페이지` 또는 `NOINDEX에 의해 제외`로 보이는 것은 의도된 상태다.
- 정상적인 `http -> https`, `www -> non-www`, slash 없는 URL -> slash URL redirect 출발 URL은 색인되지 않는 것이 정상이다.
- 공개 페이지의 sitemap URL 수는 38개다. `/summary/`, query URL, redirect 출발 URL, feed/control/static/404 URL은 sitemap에서 제외한다.
