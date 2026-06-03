import Link from "next/link";
import { BookOpenText, Heart, Info, LayoutDashboard, Menu, NotebookPen } from "lucide-react";

const primaryCalculatorLinks = [
  { href: "/calculators/wedding-cost", label: "결혼 비용" },
  { href: "/calculators/newlywed-home-budget", label: "신혼집 예산" },
  { href: "/calculators/wedding-hall-cost", label: "웨딩홀 비용" },
  { href: "/calculators/studio-dress-makeup-cost", label: "스드메 비용" },
  { href: "/calculators/honsu-budget", label: "혼수 비용" },
  { href: "/calculators/honeymoon-budget", label: "신혼여행" },
];

export function Header() {
  return (
    <header className="no-print sticky top-0 z-50 border-b border-blush-100 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[90rem] items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-black text-blush-800" aria-label="웨딩 예산 계산기 홈">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blush-100 text-blush-700">
            <Heart className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="text-lg">웨딩 예산 계산기</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="주요 메뉴">
          {primaryCalculatorLinks.map((calculator) => (
            <Link
              key={calculator.href}
              href={calculator.href}
              className="rounded-full px-3 py-2 text-base font-black text-slate-600 transition hover:bg-blush-50 hover:text-blush-800"
            >
              {calculator.label}
            </Link>
          ))}
          <Link
            href="/guides/wedding-cost-guide"
            className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-base font-black text-slate-600 transition hover:bg-blush-50 hover:text-blush-800"
          >
            <BookOpenText className="h-4 w-4" aria-hidden="true" />
            가이드
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-base font-black text-slate-600 transition hover:bg-blush-50 hover:text-blush-800"
          >
            <Info className="h-4 w-4" aria-hidden="true" />
            소개
          </Link>
          <Link
            href="/editorial-policy"
            className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-base font-black text-slate-600 transition hover:bg-blush-50 hover:text-blush-800"
          >
            <NotebookPen className="h-4 w-4" aria-hidden="true" />
            편집 기준
          </Link>
          <Link
            href="/summary"
            className="inline-flex items-center gap-2 rounded-full bg-blush-50 px-3 py-2 text-base font-black text-blush-800 transition hover:bg-blush-100"
          >
            <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
            통합 요약
          </Link>
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          <Link href="/about" className="inline-flex items-center gap-2 rounded-full border border-blush-200 px-4 py-2 text-sm font-bold text-blush-800 transition hover:bg-blush-50">
            <Info className="h-4 w-4" aria-hidden="true" />
            소개
          </Link>
          <Link href="/#calculators" className="inline-flex items-center gap-2 rounded-full border border-blush-200 px-4 py-2 text-sm font-bold text-blush-800 transition hover:bg-blush-50">
            <Menu className="h-4 w-4" aria-hidden="true" />
            계산기
          </Link>
        </div>
      </div>
    </header>
  );
}
