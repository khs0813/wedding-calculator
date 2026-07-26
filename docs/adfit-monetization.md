# Kakao AdFit Monetization

## 운영 원칙

- 1차 배포는 `calc.primaryAfterSummary`, `home.afterSituationCards`, `guideHub.afterFeatured`, `guide.mid`만 사용한다.
- `calc.secondaryAfterExample`은 `NEXT_PUBLIC_ADFIT_CALC_SECONDARY_ENABLED=true`일 때만 동작하며 1차 배포 기본값은 false다.
- 광고 요청은 `NEXT_PUBLIC_ADFIT_ENABLED=true`, 허용 호스트, 실제 DAN ID가 모두 만족될 때만 발생한다.
- 허용 호스트 기본값은 `weddingbudget.co.kr,www.weddingbudget.co.kr`이다.
- localhost, 127.0.0.1, preview, onrender.com에서는 광고를 요청하지 않는다.
- SDK는 `https://t1.kakaocdn.net/kas/static/ba.min.js`만 사용한다.
- 한 라우트에서 같은 placement는 한 번만 요청하고, 한 라우트에서 4개 이상의 AdFit 광고가 생기지 않도록 최대 3개로 제한한다.

## AdFit 콘솔 광고단위

초기에는 계산기별로 지나치게 세분화하지 않고 위치와 기기별 단위만 만든다.

```txt
wb_calc_primary_m_320x100_v1
wb_calc_primary_d_728x90_v1
wb_calc_primary_d_300x250_v1

wb_calc_secondary_m_300x250_v1
wb_calc_secondary_d_300x250_v1

wb_home_after_situations_m_320x100_v1
wb_home_after_situations_d_728x90_v1

wb_guide_hub_m_320x100_v1
wb_guide_hub_d_728x90_v1

wb_guide_mid_m_300x250_v1
wb_guide_mid_d_300x250_v1
```

## 배포 환경변수

```txt
NEXT_PUBLIC_ADFIT_ENABLED=false
NEXT_PUBLIC_ADFIT_ALLOWED_HOSTS=weddingbudget.co.kr,www.weddingbudget.co.kr
NEXT_PUBLIC_ADFIT_CALC_SECONDARY_ENABLED=false

NEXT_PUBLIC_ADFIT_CALC_PRIMARY_M_320X100=DAN-REPLACE-ME
NEXT_PUBLIC_ADFIT_CALC_PRIMARY_D_728X90=DAN-REPLACE-ME
NEXT_PUBLIC_ADFIT_CALC_PRIMARY_D_300X250=DAN-REPLACE-ME

NEXT_PUBLIC_ADFIT_CALC_SECONDARY_M_300X250=DAN-REPLACE-ME
NEXT_PUBLIC_ADFIT_CALC_SECONDARY_D_300X250=DAN-REPLACE-ME

NEXT_PUBLIC_ADFIT_HOME_AFTER_SITUATIONS_M_320X100=DAN-REPLACE-ME
NEXT_PUBLIC_ADFIT_HOME_AFTER_SITUATIONS_D_728X90=DAN-REPLACE-ME

NEXT_PUBLIC_ADFIT_GUIDE_HUB_M_320X100=DAN-REPLACE-ME
NEXT_PUBLIC_ADFIT_GUIDE_HUB_D_728X90=DAN-REPLACE-ME

NEXT_PUBLIC_ADFIT_GUIDE_MID_M_300X250=DAN-REPLACE-ME
NEXT_PUBLIC_ADFIT_GUIDE_MID_D_300X250=DAN-REPLACE-ME
```

## 페이지별 위치

- `/`: 상황별 시작 카드 4개가 끝난 뒤, 예산 계산기 목록 전에 `home.afterSituationCards` 1개.
- `/calculators/`: 광고 없음.
- `/calculators/[slug]/`: 유효한 결과 요약 뒤 64px 이상 떨어진 위치에 `calc.primaryAfterSummary` 1개.
- `/calculators/congratulatory-money/`: primary 1개만 허용.
- 긴 계산기: 실제 계산 예시 뒤 `calc.secondaryAfterExample` 후보 위치가 있으나 1차 배포에서는 비활성화.
- `/guides/`: 추천 가이드 3개가 끝난 뒤, 전체 가이드 검색과 목록 전에 `guideHub.afterFeatured` 1개.
- `/guides/[slug]/`: 본문 H2 섹션 3개가 끝난 뒤 다음 섹션 사이에 `guide.mid` 1개.
- `/summary/`, `/privacy/`, `/terms/`, `/disclaimer/`, `/contact/`, `/methodology/`, `/about/`, 404: 광고 없음.

## 14일 평가 KPI

- session RPM = AdFit 적립금 / 세션 x 1,000
- page RPM = AdFit 적립금 / 페이지뷰 x 1,000
- request RPM = AdFit 적립금 / 광고 요청수 x 1,000
- primary 도달률 = primary ad_slot_viewport_50_1s / 계산 완료 수
- secondary 도달률 = secondary ad_slot_viewport_50_1s / 계산 완료 수
- 보호 지표: 계산 완료율, 관련 계산기 클릭률, 세션당 계산기 페이지 수, 내 예산표 진입률, 공유 URL 생성률, CLS, 모바일 가로 스크롤, 오류율

2차 배포에서 secondary를 켜려면 1차 배포 14일 데이터에서 primary 도달률, Fill Rate, 계산 완료율, session RPM, CLS를 함께 확인한다. 축의금 계산기에는 secondary를 적용하지 않는다.
