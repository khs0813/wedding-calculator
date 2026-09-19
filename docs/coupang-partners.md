# Coupang Partners Monetization

## 연동 사양

- SDK: `https://ads-partners.coupang.com/g.js`
- 컴포넌트: `src/components/monetization/CoupangBanner.tsx`
- 파라미터:
  ```javascript
  new PartnersCoupang.G({
    id: 999028,
    template: "carousel",
    trackingCode: "AF4791224",
    width: "680",
    height: "140",
    tsource: "",
    container: containerElement,
  });
  ```
- 공정거래위원회 지침 준수: "이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다." 문구 함께 노출.

## 페이지별 배너 배치 위치

- `/`: 홈 Hero CTA 직후, “무엇부터 정리할까요?” 예산 정리 흐름 전
- `/calculators/`: 상황별 선택 카드 4개가 끝난 뒤, 전체 계산기 목록 전
- `/calculators/[slug]/`:
  - 상단: breadcrumb 아래, 히어로 설명 위
  - 하단: 예시 예산표 뒤
  - 결과: 유효한 결과 계산 후 요약 영역 뒤
- `/guides/`: 추천 가이드 3개가 끝난 뒤, 전체 가이드 검색/목록 전
- `/guides/[slug]/`: 본문 주요 섹션 중간
- `/summary/`, `/privacy/`, `/terms/`, `/disclaimer/`, `/contact/`, `/methodology/`, `/about/`: 배너 제외
