# 웨딩·신혼 예산 계산기

결혼 준비와 신혼집 준비에 필요한 비용을 계산하는 DB 없는 Next.js 계산기 사이트입니다.

## 구현 범위

- 메인 페이지
- 8개 계산기 페이지
  - 결혼 비용 계산기
  - 신혼집 예산 계산기
  - 웨딩홀 비용 계산기
  - 스드메 비용 계산기
  - 혼수 비용 계산기
  - 예물 예산 계산기
  - 신혼여행 예산 계산기
  - 축의금 계산기
- 통합 예산 입력·요약 페이지(`/summary`)
- 3개 SEO 가이드 페이지
- 브라우저 자동 저장/복원
- 공유 URL 생성/복원
- 브라우저 인쇄 기반 PDF 저장
- 계산기 입력값·결과 엑셀 다운로드
- 각 계산기 입력값과 결과를 한 화면에서 관리하는 통합 입력·요약 기능
- sitemap.xml, robots.txt
- FAQ 구조화 데이터
- WebApplication / Article / BreadcrumbList 구조화 데이터
- Open Graph / Twitter card 이미지
- favicon / apple-touch-icon
- 애드센스 placeholder
- 제휴 링크 placeholder
- 기본 보안 헤더와 CSP

## 기술 스택

- Next.js App Router
- TypeScript
- Tailwind CSS
- React Hook Form
- Zod
- lucide-react
- 외부 엑셀 처리 라이브러리 없는 브라우저 내장 XLSX 생성 로직
- shadcn/ui 스타일의 로컬 UI 컴포넌트

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속합니다.

## 빌드 방법

```bash
npm run build
npm run start
```

## 점검 명령어

```bash
npm run lint
npm run build
npm run audit:prod
npm run audit:all
```

- `audit:prod`: 운영 의존성 기준 취약점 점검
- `audit:all`: devDependencies까지 포함한 전체 취약점 점검

## Render 배포 방법

Render Web Service를 생성한 뒤 아래처럼 설정합니다.

```txt
Build Command: npm ci && npm run build
Start Command: npm run start
```

`render.yaml`도 포함되어 있어 Blueprint 방식으로도 사용할 수 있습니다. Node.js는 22 이상을 기준으로 설정했습니다.

### 배포·색인 안정성 체크

- `NEXT_PUBLIC_SITE_URL`은 `https://your-domain.com`이 아니라 실제 커스텀 도메인 origin으로 설정합니다.
- 이 값은 canonical, sitemap, robots.txt, Open Graph URL의 기준 URL입니다.
- `server.mjs`는 `*.onrender.com` 호스트로 들어온 요청을 `NEXT_PUBLIC_SITE_URL` origin으로 301 redirect합니다.
- `/robots.txt`는 정적 export 파일로 생성되며 `text/plain`으로 서빙됩니다.
- `/sitemap.xml`은 정적 export 파일로 생성되며 `application/xml`로 서빙됩니다.
- Render Free Web Service를 쓰면 휴면 후 첫 요청 지연으로 robots/sitemap 확인이 불안정할 수 있습니다. AdSense·Search Console 신청 전에는 유료 인스턴스, Render Static Site, 또는 robots/sitemap을 항상 즉시 응답하는 정적 호스팅을 사용하세요.
- Search Console URL Inspection에서 `/`, `/calculators/wedding-cost/`, `/calculators/newlywed-home-budget/`, `/calculators/wedding-hall-cost/`, `/guides/`, 핵심 가이드 5개를 확인합니다.
- URL Inspection 기준은 `Crawled successfully`, `Indexing allowed`, `User-declared canonical` 정상, `Google-selected canonical`이 커스텀 도메인 URL과 동일한지입니다.

## 환경변수

`.env.example`을 참고해 필요한 값만 설정합니다.

```txt
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_ADSENSE_CLIENT_ID=
NEXT_PUBLIC_ADSENSE_APPROVED=false
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=
NEXT_PUBLIC_AD_SLOT_TOP=
NEXT_PUBLIC_AD_SLOT_CONTENT=
NEXT_PUBLIC_AD_SLOT_RESULT=
ADSENSE_PUBLISHER_ID=

AFFILIATE_WEDDING_HALL_URL=#
AFFILIATE_STUDIO_DRESS_MAKEUP_URL=#
AFFILIATE_HOME_APPLIANCE_URL=#
AFFILIATE_HONEYMOON_URL=#
AFFILIATE_CLEANING_URL=#
AFFILIATE_INTERNET_URL=#
```

`NEXT_PUBLIC_SITE_URL`은 실제 배포 도메인으로 반드시 바꾸는 것이 좋습니다. 이 값은 canonical URL, sitemap, robots.txt, Open Graph URL 생성에 사용됩니다.

AdSense 신청 전에는 `NEXT_PUBLIC_ADSENSE_CLIENT_ID`에 `ca-pub-...` 값을 넣어 사이트 검토 스크립트가 모든 페이지의 `<head>`에 포함되도록 합니다. `ADSENSE_PUBLISHER_ID`에는 `pub-...` 값을 넣으면 빌드 시 `/ads.txt`가 `google.com, pub-..., DIRECT, f08c47fec0942fa0` 형식으로 생성됩니다. 승인 전에는 `NEXT_PUBLIC_ADSENSE_APPROVED=false`를 유지하고, 승인 후 광고 슬롯을 운영할 때 `true`로 전환합니다.

## 계산 로직 요약

### 결혼 비용 계산기

웨딩홀 대관/패키지 비용, 식대 총액, 스드메, 예물, 예단, 혼수, 신혼여행, 청첩장, 본식 스냅/영상, 기타 비용을 더한 뒤 예비비 비율을 적용합니다. 예상 하객 수와 1인당 예상 축의금으로 회수액을 계산하고 실제 부담 예상 금액을 보여줍니다.

### 신혼집 예산 계산기

전세보증금 또는 매매가와 각종 초기 비용을 더해 총 준비 비용을 계산합니다. 대출금, 금리, 기간을 입력하면 원리금균등상환 방식의 월 상환액, 총이자, 연간 주거비, 권장 여유자금을 표시합니다.

### 웨딩홀 비용 계산기

보증 인원과 예상 하객 수 중 큰 값을 기준으로 식대 총액을 계산합니다. 대관료, 꽃장식, 음향/조명, 혼주 메이크업, 스냅 추가, 부가세, 봉사료를 반영해 총액을 산출합니다.

### 스드메 비용 계산기

스튜디오, 드레스, 메이크업을 기본 패키지로 계산하고 헬퍼비, 원본 구매비, 앨범, 액자, 출장비 등 추가 옵션을 분리해 옵션 비중을 보여줍니다.

### 혼수 비용 계산기

가전, 가구, 생활용품을 분류해 합산합니다. 필수 항목 비용과 목표 예산 대비 초과/잔여 금액을 제공합니다.

### 예물 예산 계산기

결혼반지, 시계, 가방, 보석, 양가 선물, 한복, 기타 예물을 합산하고 전체 결혼 예산 대비 비중을 계산합니다. 신랑 측/신부 측 예상 예산은 단순 참고 배분값입니다.

### 신혼여행 예산 계산기

항공권, 숙박, 교통, 식비, 액티비티, 쇼핑, 보험, 환전, 비상금을 합산하고 1인당 비용과 1일 평균 비용을 계산합니다.

### 축의금 계산기

관계 유형별 기본 범위에 친밀도, 식사 참석, 동반자, 지역, 월소득, 과거 받은 축의금 여부를 반영해 참고용 추천 범위를 계산합니다.

## 통합 예산 입력·요약 동작

- `/summary` 페이지에서 현재 브라우저에 저장된 8개 계산기 값을 한 번에 읽어옵니다.
- 각 계산기 카드의 `입력/수정` 버튼을 열면 통합 화면에서 바로 값을 입력하거나 수정할 수 있습니다.
- 통합 화면에서 바꾼 값은 해당 계산기의 브라우저 저장값으로 자동 저장되어 개별 계산기 페이지에서도 그대로 복원됩니다.
- 저장값은 서버로 전송하지 않고 브라우저에서만 기존 계산 로직으로 다시 계산합니다.
- 결혼 비용 계산기 총액, 세부 결혼 항목 합계, 신혼집 준비 총비용, 입력 완료 계산기 수를 카드로 보여줍니다.
- 각 계산기별 대표 결과, 보조 결과, 상위 비용 항목을 카드와 표로 함께 표시합니다.
- 전체 결혼 비용 계산기와 세부 계산기 결과가 중복될 수 있으므로, 통합 화면의 참고 합계는 전체 결혼 비용 계산기를 제외하고 세부 계산기와 신혼집 계산기만 더합니다.
- 축의금 계산기는 추천 금액이므로 통합 지출 합계에는 포함하지 않습니다.
- 통합 입력·요약 화면에서도 PDF/인쇄가 가능하며, 브라우저 저장값 다시 불러오기, 계산기별 초기화, 모든 저장값 초기화 기능을 제공합니다.

## 브라우저 저장/share URL/PDF/Excel 동작

- 입력값은 계산기별로 브라우저에 자동 저장됩니다.
- 공유 URL은 입력값 JSON을 URL-safe Base64로 인코딩해 `?data=` 파라미터에 담습니다.
- 공유 URL 접속 시 입력값을 자동 복원합니다.
- 잘못된 공유 데이터는 무시하고 기본값을 사용합니다.
- 과도하게 긴 공유 데이터는 무시해 브라우저 측 파싱 부담을 줄입니다.
- PDF 다운로드는 `window.print()` 기반으로 동작합니다.
- `.no-print` 클래스는 출력에서 제외되고 `.print-area` 영역은 인쇄용 스타일이 적용됩니다.
- 엑셀 다운로드는 외부 엑셀 처리 라이브러리 없이 사용안내, 입력값, 계산결과 시트를 포함한 `.xlsx` 파일을 브라우저에서 생성합니다.
- 엑셀 가져오기와 업로드 기능은 제공하지 않습니다.

## SEO 적용 내역

- 각 계산기별 metadata(title, description, keywords, canonical, Open Graph, Twitter card)
- 메인 페이지 metadata
- 가이드 페이지 metadata
- `/summary` 통합 입력·요약 페이지 metadata와 WebApplication/BreadcrumbList schema
- `/sitemap.xml`
- `/robots.txt`
- 계산기 페이지 WebApplication schema
- 가이드 페이지 Article schema
- BreadcrumbList schema
- FAQPage schema
- 계산기별 FAQ와 관련 계산기 내부 링크
- Open Graph 기본 이미지 `/og-default.png`
- favicon과 apple-touch-icon

## 개인정보/보안 원칙

- 서버 DB 없음
- 회원가입/로그인 없음
- 이름, 전화번호, 이메일 입력 필드 없음
- 사용자가 입력한 계산값은 브라우저에만 저장
- 통합 입력·요약 페이지는 브라우저 저장값을 읽고 수정·재계산하며 서버에 전송하지 않음
- 엑셀 다운로드는 클라이언트 브라우저에서만 처리하며 서버에 파일이나 표 데이터를 전송하지 않음
- 공유 URL 데이터는 길이 제한 후 계산기 필드 기준으로 검증 및 정규화
- JSON-LD 출력은 `<`, `>`, `&`, U+2028, U+2029 문자를 이스케이프해 script-breakout XSS를 방지
- 제휴 URL 환경변수는 `https:`만 허용하고, 로컬 개발용 `http://localhost` 계열만 예외로 허용합니다. 그 외 값은 `#`로 처리
- 외부 제휴 링크는 `noopener noreferrer` 적용
- `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`, `Content-Security-Policy`, `Cross-Origin-Opener-Policy`, `Cross-Origin-Resource-Policy`, `Origin-Agent-Cluster` 보안 헤더 적용
- `poweredByHeader: false`로 Next.js 식별 헤더 비활성화

## 향후 개선 아이디어

- 체크리스트 PDF 유료 상품 페이지 추가
- 실제 제휴 링크 연동
- 애드센스 승인 후 광고 컴포넌트 활성화
- 엑셀 템플릿에 차트와 체크리스트 시트 추가
- 환율 입력을 포함한 해외 신혼여행 계산 고도화
- 결혼 준비 일정표와 예산표 연동
- 사용자가 항목을 직접 추가하는 커스텀 예산 계산기
