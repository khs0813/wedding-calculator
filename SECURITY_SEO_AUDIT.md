# SEO·보안 점검 리포트

점검일: 2026-06-01

## 최종 결과

- `npm ci`: 성공, 설치 단계 취약점 0건
- `npm run lint`: 통과
- `npm run build`: 통과
- `npm run check:seo-security`: 13개 공개 라우트 SEO/보안 설정 점검 통과
- `npm audit --omit=dev`: 0 vulnerabilities
- `npm audit`: 0 vulnerabilities
- `/sitemap.xml`: 메인 1개, 통합 입력·요약 1개, 계산기 8개, 가이드 3개 총 13개 URL 포함
- `/robots.txt`: 전체 허용 및 sitemap 경로 포함
- 주요 보안 헤더 응답 확인
- 엑셀 업로드 관련 파일 input/핸들러/아이콘/정책 함수 없음 확인

## SEO 점검 내역

- 메인/통합 입력·요약/계산기/가이드 페이지 metadata 확인
  - title
  - description
  - keywords
  - canonical
  - robots
  - Open Graph
  - Twitter card
- Open Graph 기본 이미지 유지: `/public/og-default.png`
- favicon 유지: `/public/favicon.svg`
- apple-touch-icon 유지: `/public/apple-touch-icon.png`
- 메인 페이지 WebSite / ItemList JSON-LD 유지
- 통합 입력·요약 페이지 WebApplication / BreadcrumbList JSON-LD 유지
- 계산기 페이지 WebApplication / BreadcrumbList JSON-LD 유지
- 가이드 페이지 Article / BreadcrumbList JSON-LD 유지
- FAQPage JSON-LD 유지
- 404 페이지 noindex/nofollow 유지
- `scripts/check-seo-security.mjs` 추가
  - production build 산출물의 13개 공개 HTML 라우트를 검사
  - title/description/keywords/canonical/OG/Twitter/JSON-LD/h1 확인
  - sitemap URL 개수와 robots sitemap 확인
  - 주요 보안 헤더 설정 문자열 확인

## 보안 보강 내역

- Next.js `poweredByHeader` 비활성화 유지
- HTTP 보안 헤더 보강
  - Content-Security-Policy
  - Referrer-Policy
  - X-Content-Type-Options
  - X-Frame-Options
  - X-DNS-Prefetch-Control
  - Strict-Transport-Security
  - Permissions-Policy
  - Cross-Origin-Opener-Policy
  - Cross-Origin-Resource-Policy
  - Origin-Agent-Cluster
  - X-Permitted-Cross-Domain-Policies
  - X-XSS-Protection
- CSP 보강
  - `script-src-attr 'none'` 추가
  - `media-src 'self'` 추가
- JSON-LD `dangerouslySetInnerHTML` 출력 전 안전 직렬화 유지
  - `<`, `>`, `&`, U+2028, U+2029 이스케이프
- 공유 URL 데이터 길이 제한 유지
- 브라우저 저장 복원 데이터 길이 제한 유지
- 공유 URL/브라우저 저장값 파싱 시 plain object 판별 강화
  - 일반 object 또는 null prototype object만 허용
- 계산기 입력값 상한 적용 유지
- 퍼센트 입력값 0~100 범위 제한 유지
- 대출 계산의 금리/기간 상한 적용 유지
- 통합 입력·요약 페이지는 브라우저 저장값을 읽고 수정·재계산하며 서버 전송 없음
- 통합 입력·요약 화면 보안 처리
  - 각 계산기 카드에서 입력값을 직접 수정 가능
  - 수정값은 계산기별 브라우저 저장값에만 저장
  - 입력값은 기존 `sanitizeValues` 검증과 숫자/퍼센트 상한을 그대로 통과
  - 계산기별 초기화와 전체 초기화는 현재 브라우저 저장값만 삭제
- 엑셀 업로드 기능 제거 상태 유지
- 엑셀 붙여넣기 데이터 길이/행 수 제한 유지
- 엑셀 붙여넣기 시 현재 계산기 ID와 항목ID/항목명이 일치하는 항목만 반영
- 붙여넣은 표 데이터는 서버 전송 없이 브라우저에서만 처리
- ExcelJS 의존성 제거
  - `.xlsx` 다운로드는 브라우저 내장 OOXML ZIP 생성 로직으로 전환
  - 운영 의존성 수와 오래된 하위 패키지 노출 축소
- 엑셀 문자 셀 보안 처리
  - 수식으로 실행되지 않는 inline string 저장
  - `=`, `+`, `-`, `@`, 탭, 개행 시작 문자는 텍스트로 처리
- 엑셀 붙여넣기 파서 보강
  - 엑셀 기본 TSV 붙여넣기 우선
  - 천 단위 쉼표가 있는 단일 열 값이 CSV로 오인되지 않도록 구분자 선택 개선
  - 선택형 항목명 비교를 정규화해 공백 차이에 더 강하게 처리
- 제휴 링크 환경변수 URL 검증 강화
  - `https:`만 허용
  - 로컬 개발용 `http://localhost`, `http://127.0.0.1`, `http://[::1]`만 예외 허용
  - 그 외 값은 `#` 처리
- package-lock public npm registry 사용 유지
- `.npmrc` public npm registry와 engine-strict 설정 유지
- Render 빌드 명령 `npm ci && npm run build` 유지

## 적용 중인 주요 버전

- Next.js: 16.2.6
- React: 19.2.6
- React DOM: 19.2.6
- ExcelJS: 제거됨
- Node.js: 22 이상

## 최종 검증 명령

```bash
npm ci
npm run lint
npm run build
npm run check:seo-security
npm run audit:prod
npm run audit:all
```

추가 확인:

```bash
npm ls exceljs rimraf glob fstream inflight lodash.isequal uuid --all
```

결과: 해당 패키지 없음

```bash
grep -R "type=\"file\"\|FileUp\|importCalculatorExcel\|getExcelImportPolicyText" -n src package.json README.md
```

결과: 매칭 없음

## 배포 전 필수 확인

`NEXT_PUBLIC_SITE_URL`을 실제 도메인으로 설정해야 canonical, sitemap, robots.txt, Open Graph URL이 실제 도메인으로 생성됩니다.

예시:

```txt
NEXT_PUBLIC_SITE_URL=https://your-real-domain.com
```
