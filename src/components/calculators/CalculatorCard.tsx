import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { CalculatorConfig } from "@/types/calculator";
import { Card } from "@/components/ui/card";

export function CalculatorCard({ calculator }: { calculator: CalculatorConfig }) {
  return (
    <Card className="group h-full p-6 transition hover:-translate-y-1 hover:border-blush-200 hover:shadow-lg">
      <Link href={calculator.path} className="flex h-full flex-col gap-4" aria-label={`${calculator.shortTitle}로 이동`}>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-blush-700">Calculator</p>
          <h3 className="mt-2 text-xl font-black text-slate-950">{calculator.shortTitle}</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">{calculator.description}</p>
        </div>
        <div className="mt-auto inline-flex items-center gap-2 text-sm font-black text-blush-800">
          계산하러 가기
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
        </div>
      </Link>
    </Card>
  );
}
