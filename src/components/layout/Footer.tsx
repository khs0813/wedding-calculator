import Link from "next/link";
import { calculators } from "@/data/calculators";
import { guides } from "@/data/guides";

export function Footer() {
  return (
    <footer className="no-print border-t bg-muted/40" data-nosnippet>
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <h2 className="text-lg font-semibold">웨딩 예산 계산기</h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">결혼·신혼 예산 계산기와 가이드.</p>
        </div>
        <div>
          <h3 className="font-semibold">계산기</h3>
          <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
            {calculators.slice(0, 5).map((calculator) => (
              <Link key={calculator.slug} href={calculator.path}>
                {calculator.shortTitle}
              </Link>
            ))}
            <Link href="/calculators/" className="font-medium text-foreground">
              전체 계산기 보기
            </Link>
          </div>
        </div>
        <div>
          <h3 className="font-semibold">도움말</h3>
          <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
            <Link href="/guides/">가이드</Link>
            <Link href={guides[0]?.path ?? "/guides/"}>추천 가이드</Link>
            <Link href="/contact/">문의</Link>
            <Link href="/privacy/">개인정보처리방침</Link>
            <Link href="/terms/">이용약관</Link>
            <Link href="/disclaimer/">면책고지</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
