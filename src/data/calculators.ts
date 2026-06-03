import type { CalculatorConfig } from "@/types/calculator";

export const calculators: CalculatorConfig[] = [
  {
    slug: "wedding-cost",
    path: "/calculators/wedding-cost",
    title: "결혼 비용 계산기 - 결혼 준비 비용 총정리",
    shortTitle: "결혼 비용 계산기",
    description: "웨딩홀, 식대, 스드메, 예물, 혼수, 신혼여행 비용을 입력하면 결혼 준비 총 예산과 실제 부담 예상 금액을 계산합니다.",
    hero: "결혼식과 신혼 준비에 들어가는 주요 비용을 한 번에 정리하고, 축의금 예상 회수액까지 반영해 실제 부담액을 확인해보세요.",
    keywords: ["결혼 비용 계산기", "결혼 준비 비용", "결혼식 비용", "결혼 예산"],
    storageKey: "wedding-budget:wedding-cost",
    affiliateKeys: ["weddingHall", "studioDressMakeup", "homeAppliance", "honeymoon"],
    fields: [
      { id: "weddingHallBase", label: "웨딩홀 대관/패키지 비용", type: "money", defaultValue: 0, group: "웨딩홀", helpText: "대관료, 기본 연출비 등 식대를 제외한 비용입니다." },
      { id: "mealPrice", label: "식대 1인당 비용", type: "money", defaultValue: 0, group: "웨딩홀" },
      { id: "guests", label: "예상 하객 수", type: "number", defaultValue: 0, suffix: "명", group: "웨딩홀" },
      { id: "averageGiftPerGuest", label: "하객 1인당 예상 축의금", type: "money", defaultValue: 50000, group: "회수액", helpText: "실제 축의금은 관계와 지역에 따라 달라질 수 있습니다." },
      { id: "sdmeCost", label: "스드메 비용", type: "money", defaultValue: 0, group: "예식 준비" },
      { id: "giftCost", label: "예물 비용", type: "money", defaultValue: 0, group: "예식 준비" },
      { id: "yedanCost", label: "예단 비용", type: "money", defaultValue: 0, group: "예식 준비" },
      { id: "honsuCost", label: "혼수 비용", type: "money", defaultValue: 0, group: "신혼 준비" },
      { id: "honeymoonCost", label: "신혼여행 비용", type: "money", defaultValue: 0, group: "신혼 준비" },
      { id: "invitationCost", label: "청첩장 비용", type: "money", defaultValue: 0, group: "기타" },
      { id: "snapVideoCost", label: "본식 스냅/영상 비용", type: "money", defaultValue: 0, group: "기타" },
      { id: "extraCost", label: "사회자/축가/폐백 등 기타 비용", type: "money", defaultValue: 0, group: "기타" },
      { id: "contingencyRate", label: "예비비 비율", type: "percent", defaultValue: 5, suffix: "%", group: "예비비" },
      { id: "targetBudget", label: "전체 목표 예산", type: "money", defaultValue: 0, group: "예산 비교", helpText: "입력하지 않으면 예산 초과 여부는 표시하지 않습니다." }
    ],
    faqs: [
      { question: "결혼 준비 비용 계산 결과가 저장되나요?", answer: "서버에는 저장하지 않고 현재 브라우저에만 저장됩니다. 같은 브라우저로 다시 접속하면 이전 입력값을 복원할 수 있습니다." },
      { question: "축의금 예상 회수액은 정확한가요?", answer: "예상 하객 수와 1인당 예상 축의금으로 단순 계산한 참고값입니다. 실제 금액은 관계, 참석률, 지역에 따라 달라질 수 있습니다." },
      { question: "예비비는 얼마나 잡는 것이 좋나요?", answer: "계약 후 추가 옵션, 헬퍼비, 출장비, 소모품 구매가 생기는 경우가 많으므로 5~10% 정도를 예비비로 잡는 것이 안전합니다." }
    ],
    relatedSlugs: ["wedding-hall-cost", "studio-dress-makeup-cost", "honsu-budget"]
  },
  {
    slug: "newlywed-home-budget",
    path: "/calculators/newlywed-home-budget",
    title: "신혼집 예산 계산기 - 신혼집 준비 비용 계산",
    shortTitle: "신혼집 예산 계산기",
    description: "전세보증금, 월세, 관리비, 인테리어, 가전·가구, 이사비와 대출 상환액을 반영해 신혼집 준비 예산을 계산합니다.",
    hero: "초기 현금 필요액과 매월 나가는 주거비를 함께 계산해 신혼집 준비에 필요한 현실적인 예산을 확인하세요.",
    keywords: ["신혼집 예산 계산기", "신혼집 비용", "신혼집 준비 비용", "신혼부부 집 예산"],
    storageKey: "wedding-budget:newlywed-home",
    affiliateKeys: ["homeAppliance", "cleaning", "internet"],
    fields: [
      { id: "homePrice", label: "전세보증금 또는 매매가", type: "money", defaultValue: 0, group: "주거비" },
      { id: "monthlyRent", label: "월세", type: "money", defaultValue: 0, group: "월 고정비" },
      { id: "maintenanceFee", label: "관리비", type: "money", defaultValue: 0, group: "월 고정비" },
      { id: "interiorCost", label: "인테리어 비용", type: "money", defaultValue: 0, group: "초기 비용" },
      { id: "applianceCost", label: "가전 구매 비용", type: "money", defaultValue: 0, group: "초기 비용" },
      { id: "furnitureCost", label: "가구 구매 비용", type: "money", defaultValue: 0, group: "초기 비용" },
      { id: "movingCost", label: "이사 비용", type: "money", defaultValue: 0, group: "초기 비용" },
      { id: "cleaningCost", label: "입주청소 비용", type: "money", defaultValue: 0, group: "초기 비용" },
      { id: "internetInstallCost", label: "인터넷/TV 설치비", type: "money", defaultValue: 0, group: "초기 비용" },
      { id: "livingGoodsCost", label: "생활용품 초기 구매비", type: "money", defaultValue: 0, group: "초기 비용" },
      { id: "loanAmount", label: "대출금", type: "money", defaultValue: 0, group: "대출" },
      { id: "annualRate", label: "대출금리", type: "percent", defaultValue: 0, suffix: "%", group: "대출" },
      { id: "loanYears", label: "대출기간", type: "number", defaultValue: 0, suffix: "년", group: "대출" }
    ],
    faqs: [
      { question: "초기 현금 필요액은 어떻게 계산하나요?", answer: "보증금 또는 매매가에서 대출금을 뺀 금액에 인테리어, 가전, 가구, 이사, 청소 등 초기 비용을 더해 계산합니다." },
      { question: "대출 월 상환액은 어떤 방식인가요?", answer: "연이율과 기간을 기준으로 원리금균등상환 공식을 적용합니다. 금리가 0%이면 원금을 개월 수로 나눕니다." },
      { question: "신혼집 예산에 예비비도 필요할까요?", answer: "입주 후 수리, 추가 가구, 생활용품 구매가 생기기 쉬우므로 초기 비용의 5~10%를 여유자금으로 준비하는 것이 좋습니다." }
    ],
    relatedSlugs: ["honsu-budget", "wedding-cost", "honeymoon-budget"]
  },
  {
    slug: "wedding-hall-cost",
    path: "/calculators/wedding-hall-cost",
    title: "웨딩홀 비용 계산기 - 식대·대관료 총액 계산",
    shortTitle: "웨딩홀 비용 계산기",
    description: "보증 인원, 예상 하객 수, 식대, 대관료, 꽃장식, 부가세와 봉사료를 입력해 웨딩홀 비용을 계산합니다.",
    hero: "웨딩홀 견적에서 가장 큰 비중을 차지하는 식대와 보증 인원 기준 최소 비용을 비교해보세요.",
    keywords: ["웨딩홀 비용 계산기", "웨딩홀 비용", "결혼식장 비용", "식대 계산"],
    storageKey: "wedding-budget:wedding-hall",
    affiliateKeys: ["weddingHall"],
    fields: [
      { id: "guaranteeGuests", label: "보증 인원", type: "number", defaultValue: 0, suffix: "명", group: "인원" },
      { id: "expectedGuests", label: "예상 하객 수", type: "number", defaultValue: 0, suffix: "명", group: "인원" },
      { id: "mealPrice", label: "식대 1인당 비용", type: "money", defaultValue: 0, group: "식대" },
      { id: "rentalFee", label: "대관료", type: "money", defaultValue: 0, group: "기본 비용" },
      { id: "floralFee", label: "꽃장식 비용", type: "money", defaultValue: 0, group: "기본 비용" },
      { id: "soundLightingFee", label: "음향/조명 비용", type: "money", defaultValue: 0, group: "기본 비용" },
      { id: "parentMakeupFee", label: "혼주 메이크업 비용", type: "money", defaultValue: 0, group: "추가 비용" },
      { id: "snapExtraFee", label: "원판/스냅 추가 비용", type: "money", defaultValue: 0, group: "추가 비용" },
      { id: "vatIncluded", label: "부가세 포함 견적", type: "checkbox", defaultValue: true, group: "세금/봉사료" },
      { id: "serviceRate", label: "봉사료 비율", type: "percent", defaultValue: 0, suffix: "%", group: "세금/봉사료" },
      { id: "averageGiftPerGuest", label: "하객 1인당 예상 축의금", type: "money", defaultValue: 50000, group: "비교" }
    ],
    faqs: [
      { question: "보증 인원보다 하객이 적으면 어떻게 계산되나요?", answer: "식대는 보증 인원과 예상 하객 수 중 더 큰 값을 기준으로 계산합니다. 실제 계약 조건은 웨딩홀마다 다를 수 있습니다." },
      { question: "부가세 포함 여부를 왜 입력하나요?", answer: "견적서가 부가세 포함인지 별도인지에 따라 최종 결제액이 달라질 수 있어 별도 견적이면 10%를 추가 계산합니다." },
      { question: "축의금과 비교한 순부담액은 무엇인가요?", answer: "웨딩홀 총 비용에서 예상 축의금 회수액을 뺀 참고 금액입니다. 실제 축의금은 참석자와 관계에 따라 달라집니다." }
    ],
    relatedSlugs: ["wedding-cost", "congratulatory-money", "studio-dress-makeup-cost"]
  },
  {
    slug: "studio-dress-makeup-cost",
    path: "/calculators/studio-dress-makeup-cost",
    title: "스드메 비용 계산기 - 스튜디오·드레스·메이크업 가격 계산",
    shortTitle: "스드메 비용 계산기",
    description: "스튜디오, 드레스, 메이크업 기본 비용과 헬퍼비, 원본, 앨범, 액자, 출장비 등 추가 옵션 비용을 계산합니다.",
    hero: "스드메는 기본 패키지보다 추가 옵션에서 예산이 늘어나는 경우가 많습니다. 옵션 비중을 따로 확인해보세요.",
    keywords: ["스드메 비용 계산기", "스드메 가격", "스튜디오 드레스 메이크업 비용"],
    storageKey: "wedding-budget:studio-dress-makeup",
    affiliateKeys: ["studioDressMakeup"],
    fields: [
      { id: "studioCost", label: "스튜디오 촬영 비용", type: "money", defaultValue: 0, group: "기본 패키지" },
      { id: "dressCost", label: "드레스 대여 비용", type: "money", defaultValue: 0, group: "기본 패키지" },
      { id: "makeupCost", label: "메이크업 비용", type: "money", defaultValue: 0, group: "기본 패키지" },
      { id: "ceremonyDressExtra", label: "본식 드레스 추가 비용", type: "money", defaultValue: 0, group: "추가 옵션" },
      { id: "tuxedoCost", label: "턱시도 비용", type: "money", defaultValue: 0, group: "추가 옵션" },
      { id: "helperFee", label: "헬퍼비", type: "money", defaultValue: 0, group: "추가 옵션" },
      { id: "rawFileFee", label: "원본 구매비", type: "money", defaultValue: 0, group: "추가 옵션" },
      { id: "albumExtraFee", label: "앨범 추가비", type: "money", defaultValue: 0, group: "추가 옵션" },
      { id: "frameExtraFee", label: "액자 추가비", type: "money", defaultValue: 0, group: "추가 옵션" },
      { id: "travelFee", label: "출장비", type: "money", defaultValue: 0, group: "추가 옵션" },
      { id: "etcOptionFee", label: "기타 옵션 비용", type: "money", defaultValue: 0, group: "추가 옵션" }
    ],
    faqs: [
      { question: "스드메 기본 패키지와 추가 옵션은 어떻게 구분하나요?", answer: "스튜디오, 드레스, 메이크업은 기본 패키지로 묶고, 헬퍼비·원본·앨범·액자·출장비 등은 추가 옵션으로 따로 계산합니다." },
      { question: "원본 구매비도 꼭 넣어야 하나요?", answer: "스튜디오 계약에 따라 원본 파일이 별도 유료인 경우가 많기 때문에 견적 비교 시 원본 구매비를 포함하는 것이 좋습니다." },
      { question: "스드메 비용을 줄이려면 어떤 항목을 봐야 하나요?", answer: "앨범 페이지 추가, 액자 업그레이드, 드레스 추가금 등 선택 옵션의 비중이 큰지 확인하는 것이 좋습니다." }
    ],
    relatedSlugs: ["wedding-cost", "wedding-gift-budget", "wedding-hall-cost"]
  },
  {
    slug: "honsu-budget",
    path: "/calculators/honsu-budget",
    title: "혼수 비용 계산기 - 신혼 가전·가구 예산 계산",
    shortTitle: "혼수 비용 계산기",
    description: "냉장고, 세탁기, 건조기, TV, 에어컨, 침대, 소파 등 신혼 가전과 가구 예산을 항목별로 계산합니다.",
    hero: "필수 가전·가구와 선택 품목을 나눠 혼수 예산을 정리하고 목표 예산 대비 초과 여부를 확인하세요.",
    keywords: ["혼수 비용 계산기", "신혼 가전 예산", "혼수 가전 비용", "신혼집 가구 예산"],
    storageKey: "wedding-budget:honsu",
    affiliateKeys: ["homeAppliance"],
    fields: [
      { id: "fridge", label: "냉장고", type: "money", defaultValue: 0, group: "가전", required: true },
      { id: "washer", label: "세탁기", type: "money", defaultValue: 0, group: "가전", required: true },
      { id: "dryer", label: "건조기", type: "money", defaultValue: 0, group: "가전" },
      { id: "tv", label: "TV", type: "money", defaultValue: 0, group: "가전" },
      { id: "aircon", label: "에어컨", type: "money", defaultValue: 0, group: "가전" },
      { id: "vacuum", label: "청소기", type: "money", defaultValue: 0, group: "가전" },
      { id: "bed", label: "침대", type: "money", defaultValue: 0, group: "가구", required: true },
      { id: "sofa", label: "소파", type: "money", defaultValue: 0, group: "가구" },
      { id: "diningTable", label: "식탁", type: "money", defaultValue: 0, group: "가구" },
      { id: "closet", label: "옷장", type: "money", defaultValue: 0, group: "가구" },
      { id: "curtain", label: "커튼/블라인드", type: "money", defaultValue: 0, group: "가구" },
      { id: "kitchenware", label: "주방용품", type: "money", defaultValue: 0, group: "생활용품" },
      { id: "smallAppliances", label: "생활가전", type: "money", defaultValue: 0, group: "생활용품" },
      { id: "etc", label: "기타 비용", type: "money", defaultValue: 0, group: "생활용품" },
      { id: "targetBudget", label: "혼수 목표 예산", type: "money", defaultValue: 0, group: "예산 비교" }
    ],
    faqs: [
      { question: "혼수 예산에서 가전과 가구를 따로 봐야 하나요?", answer: "가전은 브랜드와 용량에 따라 가격 차이가 크고, 가구는 집 크기와 인테리어 방향에 따라 달라지므로 구분해서 보는 것이 좋습니다." },
      { question: "필수 항목과 선택 항목은 어떻게 판단하나요?", answer: "냉장고, 세탁기, 침대처럼 입주 직후 필요한 것은 필수로 보고, 건조기·TV·소파 등은 생활 패턴에 따라 선택 항목으로 조정할 수 있습니다." },
      { question: "목표 예산을 입력하지 않아도 되나요?", answer: "네. 목표 예산을 입력하면 초과 또는 잔여 금액을 보여주고, 입력하지 않으면 총액과 비중만 계산합니다." }
    ],
    relatedSlugs: ["newlywed-home-budget", "wedding-cost", "honeymoon-budget"]
  },
  {
    slug: "wedding-gift-budget",
    path: "/calculators/wedding-gift-budget",
    title: "예물 예산 계산기 - 결혼 예물 비용 계산",
    shortTitle: "예물 예산 계산기",
    description: "결혼반지, 예물 시계, 가방, 보석, 양가 선물, 한복 등 예물 예산을 항목별로 계산합니다.",
    hero: "예물은 양가 합의와 커플의 가치관에 따라 달라지는 항목입니다. 항목별 비용을 정리해 전체 결혼 예산 대비 비중을 확인하세요.",
    keywords: ["예물 예산 계산기", "예물 비용", "결혼 예물 비용", "결혼반지 비용"],
    storageKey: "wedding-budget:wedding-gift",
    affiliateKeys: ["studioDressMakeup"],
    fields: [
      { id: "rings", label: "결혼반지", type: "money", defaultValue: 0, group: "예물" },
      { id: "watch", label: "예물 시계", type: "money", defaultValue: 0, group: "예물" },
      { id: "bag", label: "예물 가방", type: "money", defaultValue: 0, group: "예물" },
      { id: "jewelry", label: "예물 보석", type: "money", defaultValue: 0, group: "예물" },
      { id: "familyGift", label: "양가 선물", type: "money", defaultValue: 0, group: "가족 선물" },
      { id: "hanbok", label: "한복 비용", type: "money", defaultValue: 0, group: "가족 선물" },
      { id: "etc", label: "기타 예물 비용", type: "money", defaultValue: 0, group: "기타" },
      { id: "totalWeddingBudget", label: "전체 결혼 목표 예산", type: "money", defaultValue: 0, group: "비중 계산" }
    ],
    faqs: [
      { question: "예물은 꼭 해야 하나요?", answer: "정해진 답은 없습니다. 커플과 양가의 합의가 가장 중요하며, 최근에는 실용적인 선물이나 간소화된 예물로 조정하는 경우도 많습니다." },
      { question: "전체 결혼 예산 대비 예물 비중은 왜 보나요?", answer: "예물 비용이 다른 준비 항목을 압박하지 않는지 확인하기 위해 전체 예산 대비 비중을 함께 보는 것이 좋습니다." },
      { question: "신랑 측·신부 측 예산은 정확한가요?", answer: "입력 항목을 바탕으로 단순 배분한 참고값입니다. 실제 부담 방식은 양가 합의에 따라 달라질 수 있습니다." }
    ],
    relatedSlugs: ["wedding-cost", "studio-dress-makeup-cost", "congratulatory-money"]
  },
  {
    slug: "honeymoon-budget",
    path: "/calculators/honeymoon-budget",
    title: "신혼여행 예산 계산기 - 허니문 비용 계산",
    shortTitle: "신혼여행 예산 계산기",
    description: "항공권, 숙박, 교통, 식비, 액티비티, 쇼핑, 여행자보험, 환전, 비상금을 입력해 신혼여행 총 비용을 계산합니다.",
    hero: "총 여행비뿐 아니라 1인당 비용과 1일 평균 비용을 함께 확인해 허니문 예산을 현실적으로 잡아보세요.",
    keywords: ["신혼여행 예산 계산기", "신혼여행 비용", "허니문 비용", "해외여행 예산"],
    storageKey: "wedding-budget:honeymoon",
    affiliateKeys: ["honeymoon"],
    fields: [
      { id: "flight", label: "항공권 비용", type: "money", defaultValue: 0, group: "교통/숙박" },
      { id: "hotel", label: "숙박비", type: "money", defaultValue: 0, group: "교통/숙박" },
      { id: "localTransport", label: "현지 교통비", type: "money", defaultValue: 0, group: "교통/숙박" },
      { id: "food", label: "식비", type: "money", defaultValue: 0, group: "현지 비용" },
      { id: "activity", label: "관광/액티비티 비용", type: "money", defaultValue: 0, group: "현지 비용" },
      { id: "shopping", label: "쇼핑 예산", type: "money", defaultValue: 0, group: "현지 비용" },
      { id: "insurance", label: "여행자보험", type: "money", defaultValue: 0, group: "준비 비용" },
      { id: "exchange", label: "환전 예산", type: "money", defaultValue: 0, group: "준비 비용" },
      { id: "emergency", label: "비상금", type: "money", defaultValue: 0, group: "준비 비용" },
      { id: "days", label: "여행 일수", type: "number", defaultValue: 1, suffix: "일", group: "인원/기간" },
      { id: "people", label: "인원 수", type: "number", defaultValue: 2, suffix: "명", group: "인원/기간" },
      { id: "targetBudget", label: "신혼여행 목표 예산", type: "money", defaultValue: 0, group: "예산 비교" }
    ],
    faqs: [
      { question: "환전 예산과 현지 식비가 중복될 수 있나요?", answer: "현지에서 사용할 현금성 예산을 환전 예산으로 따로 관리하고, 카드 결제 예정 식비·교통비는 개별 항목으로 입력하면 중복을 줄일 수 있습니다." },
      { question: "1일 평균 비용은 어떻게 계산하나요?", answer: "신혼여행 총 비용을 여행 일수로 나누어 계산합니다. 인원 수를 입력하면 1인당 비용도 함께 표시합니다." },
      { question: "비상금은 얼마나 잡는 것이 좋나요?", answer: "항공 지연, 수하물 문제, 의료비, 현지 일정 변경 등에 대비해 전체 여행비의 일부를 비상금으로 따로 잡는 것이 좋습니다." }
    ],
    relatedSlugs: ["wedding-cost", "newlywed-home-budget", "honsu-budget"]
  },
  {
    slug: "congratulatory-money",
    path: "/calculators/congratulatory-money",
    title: "축의금 계산기 - 관계별 결혼식 축의금 추천 범위",
    shortTitle: "축의금 계산기",
    description: "가족, 친척, 친구, 직장동료, 거래처 등 관계와 식사 참석 여부를 입력해 참고용 축의금 추천 범위를 계산합니다.",
    hero: "관계, 친밀도, 식사 참석, 동반자 여부를 반영해 참고용 축의금 범위를 확인하세요. 정답이 아니라 개인 상황에 맞춘 참고값입니다.",
    keywords: ["축의금 계산기", "축의금 얼마", "결혼식 축의금", "친구 축의금", "직장동료 축의금"],
    storageKey: "wedding-budget:congratulatory-money",
    affiliateKeys: ["weddingHall"],
    fields: [
      { id: "relation", label: "관계 유형", type: "select", defaultValue: "friend-close", group: "관계", options: [
        { label: "가족", value: "family" },
        { label: "친척", value: "relative" },
        { label: "친한 친구", value: "friend-close" },
        { label: "일반 친구", value: "friend" },
        { label: "직장 상사", value: "boss" },
        { label: "직장 동료", value: "coworker" },
        { label: "거래처", value: "client" },
        { label: "지인", value: "acquaintance" }
      ] },
      { id: "closeness", label: "친밀도", type: "select", defaultValue: "normal", group: "관계", options: [
        { label: "낮음", value: "low" },
        { label: "보통", value: "normal" },
        { label: "높음", value: "high" },
        { label: "매우 높음", value: "very-high" }
      ] },
      { id: "attendMeal", label: "식사 참석 예정", type: "checkbox", defaultValue: true, group: "참석" },
      { id: "withCompanion", label: "동반자와 참석", type: "checkbox", defaultValue: false, group: "참석" },
      { id: "region", label: "지역", type: "select", defaultValue: "metro", group: "상황", options: [
        { label: "수도권", value: "metro" },
        { label: "광역시", value: "city" },
        { label: "그 외 지역", value: "local" }
      ] },
      { id: "income", label: "본인의 월소득 구간", type: "select", defaultValue: "middle", group: "상황", options: [
        { label: "200만원 미만", value: "low" },
        { label: "200만~400만원", value: "middle" },
        { label: "400만~700만원", value: "high" },
        { label: "700만원 이상", value: "very-high" }
      ] },
      { id: "receivedBefore", label: "과거 받은 축의금 있음", type: "checkbox", defaultValue: false, group: "상호성" },
      { id: "receivedAmount", label: "과거 받은 축의금 금액", type: "money", defaultValue: 0, group: "상호성", helpText: "받은 적이 있다면 그 금액을 기준으로 추천 범위를 보정합니다." }
    ],
    faqs: [
      { question: "축의금 계산기는 정답을 알려주나요?", answer: "아니요. 관계와 참석 상황을 기준으로 참고용 범위를 제안합니다. 실제 금액은 개인 사정과 관계에 따라 달라질 수 있습니다." },
      { question: "식사 참석 여부가 왜 중요하나요?", answer: "식사를 하면 예식장 식대 부담이 발생하기 때문에 일반적으로 축의금 판단 시 식사 참석 여부를 함께 고려합니다." },
      { question: "과거 받은 축의금은 어떻게 반영되나요?", answer: "과거 받은 금액이 있으면 일반 추천 금액이 그 금액보다 크게 낮아지지 않도록 참고값에 반영합니다." }
    ],
    relatedSlugs: ["wedding-hall-cost", "wedding-cost", "wedding-gift-budget"]
  }
];

export function getCalculatorBySlug(slug: string) {
  return calculators.find((calculator) => calculator.slug === slug);
}
