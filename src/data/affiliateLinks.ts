import { sanitizeHttpUrl } from "@/lib/security";
import type { AffiliateKey } from "@/types/calculator";

export const affiliateLabels: Record<AffiliateKey, { title: string; description: string; url: string }> = {
  weddingHall: {
    title: "웨딩홀 상담",
    description: "보증 인원과 식대 조건을 비교해보세요.",
    url: sanitizeHttpUrl(process.env.AFFILIATE_WEDDING_HALL_URL)
  },
  studioDressMakeup: {
    title: "스드메 상담",
    description: "기본 패키지와 옵션 포함 여부를 확인해보세요.",
    url: sanitizeHttpUrl(process.env.AFFILIATE_STUDIO_DRESS_MAKEUP_URL)
  },
  homeAppliance: {
    title: "가전/가구 구매",
    description: "신혼집 필수 가전·가구 예산을 비교해보세요.",
    url: sanitizeHttpUrl(process.env.AFFILIATE_HOME_APPLIANCE_URL)
  },
  honeymoon: {
    title: "신혼여행 상담",
    description: "항공권, 숙박, 액티비티 예산을 함께 점검하세요.",
    url: sanitizeHttpUrl(process.env.AFFILIATE_HONEYMOON_URL)
  },
  cleaning: {
    title: "입주청소",
    description: "입주 전 청소와 생활 준비 비용을 확인해보세요.",
    url: sanitizeHttpUrl(process.env.AFFILIATE_CLEANING_URL)
  },
  internet: {
    title: "인터넷 가입",
    description: "신혼집 인터넷/TV 설치 비용을 비교해보세요.",
    url: sanitizeHttpUrl(process.env.AFFILIATE_INTERNET_URL)
  }
};
