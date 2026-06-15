"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BookOpenText, Calculator, ChevronDown, Heart, Info, Mail, Menu, NotebookPen, X } from "lucide-react";

const primaryCalculatorLinks = [
  { href: "/calculators/wedding-cost", label: "결혼 비용" },
  { href: "/calculators/newlywed-home-budget", label: "신혼집 예산" },
  { href: "/calculators/wedding-hall-cost", label: "웨딩홀 비용" },
  { href: "/calculators/studio-dress-makeup-cost", label: "스드메 비용" },
  { href: "/calculators/honsu-budget", label: "혼수 비용" },
  { href: "/calculators/wedding-gift-budget", label: "예물 예산" },
  { href: "/calculators/honeymoon-budget", label: "신혼여행" },
  { href: "/calculators/congratulatory-money", label: "축의금" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [mobileCalculatorOpen, setMobileCalculatorOpen] = useState(false);

  function isCurrent(href: string) {
    return pathname === href || pathname === `${href}/`;
  }

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

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
          <div className="relative" onMouseEnter={() => setCalculatorOpen(true)} onMouseLeave={() => setCalculatorOpen(false)}>
            <button
              type="button"
              onClick={() => setCalculatorOpen((current) => !current)}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  setCalculatorOpen(false);
                }
              }}
              className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 py-2 text-base font-black text-slate-600 transition hover:bg-blush-50 hover:text-blush-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blush-200"
              aria-expanded={calculatorOpen}
              aria-controls="desktop-calculator-menu"
            >
              계산기
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            </button>
            <div
              id="desktop-calculator-menu"
              className={
                calculatorOpen
                  ? "visible absolute right-0 top-full w-[28rem] translate-y-0 rounded-3xl border border-blush-100 bg-white p-3 opacity-100 shadow-soft transition"
                  : "invisible absolute right-0 top-full w-[28rem] translate-y-2 rounded-3xl border border-blush-100 bg-white p-3 opacity-0 shadow-soft transition"
              }
            >
              <div className="grid grid-cols-2 gap-2">
                {primaryCalculatorLinks.map((calculator) => (
                  <Link
                    key={calculator.href}
                    href={calculator.href}
                    onClick={() => setCalculatorOpen(false)}
                    className="rounded-2xl px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-blush-50 hover:text-blush-800"
                    aria-current={isCurrent(calculator.href) ? "page" : undefined}
                  >
                    {calculator.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <Link
            href="/guides"
            className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-base font-black text-slate-600 transition hover:bg-blush-50 hover:text-blush-800"
            aria-current={isCurrent("/guides") ? "page" : undefined}
          >
            가이드
          </Link>
          <Link
            href="/methodology"
            className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-base font-black text-slate-600 transition hover:bg-blush-50 hover:text-blush-800"
            aria-current={isCurrent("/methodology") ? "page" : undefined}
          >
            계산 기준
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-base font-black text-slate-600 transition hover:bg-blush-50 hover:text-blush-800"
            aria-current={isCurrent("/contact") ? "page" : undefined}
          >
            문의
          </Link>
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          <Link href="/calculators/wedding-cost" className="inline-flex min-h-10 items-center gap-2 rounded-full border border-blush-200 px-4 py-2 text-sm font-bold text-blush-800 transition hover:bg-blush-50">
            <Calculator className="h-4 w-4" aria-hidden="true" />
            계산 시작
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen((current) => !current)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-blush-200 text-blush-800 transition hover:bg-blush-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blush-200"
            aria-label="모바일 메뉴"
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
          >
            {mobileOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>
      {mobileOpen ? (
        <nav id="mobile-navigation" className="border-t border-blush-100 bg-white px-4 py-4 lg:hidden" aria-label="모바일 주요 메뉴">
          <Link
            href="/calculators/wedding-cost"
            onClick={() => setMobileOpen(false)}
            aria-current={isCurrent("/calculators/wedding-cost") ? "page" : undefined}
            className="mb-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl bg-blush-800 px-4 py-3 text-sm font-black text-white transition hover:bg-blush-700"
          >
            <Calculator className="h-4 w-4" aria-hidden="true" />
            계산 시작
          </Link>
          <div className="rounded-2xl border border-blush-100 bg-white">
            <button
              type="button"
              className="flex min-h-12 w-full items-center justify-between px-4 py-3 text-left text-sm font-black text-slate-800"
              aria-expanded={mobileCalculatorOpen}
              aria-controls="mobile-calculator-list"
              onClick={() => setMobileCalculatorOpen((current) => !current)}
            >
              <span>계산기 목록</span>
              <ChevronDown className={mobileCalculatorOpen ? "h-4 w-4 rotate-180 transition" : "h-4 w-4 transition"} aria-hidden="true" />
            </button>
            {mobileCalculatorOpen ? (
              <div id="mobile-calculator-list" className="grid gap-1 border-t border-blush-100 px-2 py-2">
                {primaryCalculatorLinks.map((calculator) => (
                <Link
                  key={calculator.href}
                  href={calculator.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-blush-50 hover:text-blush-800"
                  aria-current={isCurrent(calculator.href) ? "page" : undefined}
                >
                  {calculator.label}
                </Link>
              ))}
              </div>
            ) : null}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 border-t border-blush-100 pt-3">
            {[
              { href: "/guides", label: "가이드", icon: BookOpenText },
              { href: "/methodology", label: "계산 기준", icon: NotebookPen },
              { href: "/contact", label: "문의", icon: Mail },
              { href: "/about", label: "소개", icon: Info },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex min-h-11 items-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-blush-50 hover:text-blush-800"
                  aria-current={isCurrent(item.href) ? "page" : undefined}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
