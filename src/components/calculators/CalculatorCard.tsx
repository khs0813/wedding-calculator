import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { CalculatorConfig } from "@/types/calculator";
import { Card, CardContent } from "@/components/ui/card";

const calculatorOutcomes: Record<CalculatorConfig["slug"], string> = {
  "wedding-cost": "총액과 실제 부담액",
  "newlywed-home-budget": "초기 현금과 월 고정비",
  "wedding-hall-cost": "식대와 보증 인원 부담",
  "studio-dress-makeup-cost": "기본가와 옵션 비중",
  "honsu-budget": "필수 혼수와 선택 품목",
  "wedding-gift-budget": "예물 총액과 예산 비중",
  "honeymoon-budget": "1인당·1일 평균 비용",
  "congratulatory-money": "관계별 축의금 범위",
};

export function CalculatorCard({ calculator }: { calculator: CalculatorConfig }) {
  return (
    <Link href={calculator.path} aria-label={`${calculator.shortTitle}로 이동`} className="group block h-full">
      <Card className="h-full transition group-hover:-translate-y-1 group-hover:shadow-md">
        <CardContent className="flex h-full flex-col p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">계산기</p>
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-foreground">
              {calculatorOutcomes[calculator.slug]}
            </span>
          </div>
          <h3 className="mt-3 text-xl font-semibold">{calculator.shortTitle}</h3>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{calculator.description}</p>
          <span className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-semibold text-foreground">
            계산하기
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
